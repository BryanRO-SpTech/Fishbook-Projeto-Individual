const userModel = require("../models/user.model.js");
const friendModel = require("../models/friends.model.js");
const userDto = require("../dtos/user.dto.js");
const appError = require("../errors/appError.js");
const bcrypt = require("bcrypt");
const CryptoJS = require("crypto-js");
const fs = require("fs");
const path = require("path");

const createUser = async (req, res, next) => {
    const { name, email, username, password, bio } = req.body;

    try {
        const validations = userDto.createDto({ name, email, username, password, bio });

        if (!validations.isValid) {
            throw appError(validations.errors, 400);
        }

        const hash = await bcrypt.hash(password, 10);

        const result = await userModel.create({ name, email, username, password: hash, bio });

        if (result && result.isAppError) {
            throw result;
        }

        return res.status(201).cookie("userCreationConfirm", JSON.stringify({
            userId: result.insertId
        }), {
            httpOnly: true,
            signed: true,
            maxAge: 1 * 1000 * 15, // 15 seg
            sameSite: "strict"
        }).json({ message: "User created successfully", user: { name, email, username, bio } });

    } catch (error) {
        next(error);
    }
}


const updateProfilePhotoOnUserCreate = async (req, res, next) => {
    const profilePhoto = req.file;
    const { userId } = req.userCreationConfirm;


    try {
        if (!profilePhoto) {
            throw appError("Profile photo not found", 400);
        }

        await userModel.updateProfilePhoto(userId, profilePhoto.filename);

        return res.status(201).cookie("userCreationConfirm", "", {
            httpOnly: true,
            signed: true,
            maxAge: 0,
            sameSite: "strict"
        }).json({ message: "User profile photo updated successfully" });

    } catch (error) {
        next(error);
    }
}

const updateProfile = async (req, res, next) => {
    const { name, email, bio } = req.body;
    const { id } = req.session;

    try {
        const validations = userDto.updateDto({ name, email, bio });

        if (!validations.isValid) {
            throw appError(validations.errors, 400);
        }

        const update = await userModel.updateProfile(id, { name, email, bio });

        if (update && update.isAppError) {
            throw update;
        }

        return res.status(200).json({ message: "User updated successfully" });

    } catch (error) {
        next(error);
    }
}

const updateProfilePhoto = async (req, res, next) => {
    const { id } = req.session;
    const profilePhoto = req.file;

    try {
        if (!profilePhoto) {
            throw appError("Profile photo not found", 400);
        }

        const user = await userModel.getById(id);

        if (user.profilePhotoPath) {
            await fs.promises.rm(path.join(__dirname, "../../uploads/", user.profilePhotoPath));
        }

        await userModel.updateProfilePhoto(id, profilePhoto.filename);

        return res.status(200).json({
            message: "Profile photo successfully updated",
            imagePath: profilePhoto.filename
        });
    } catch (error) {
        return next(error);
    }
};


const updatePassword = async (req, res, next) => {
    const { id } = req.session;
    const { oldPassword, newPassword } = req.body;

    try {
        if (!oldPassword || !newPassword) {
            throw appError("Old password and new password are required", 400);
        }

        const validations = userDto.updatePasswordDto(newPassword);

        if (!validations.isValid) {
            throw appError(validations.errors, 400);
        }

        const user = await userModel.getById(id);

        const isValidPassword = await bcrypt.compare(oldPassword, user.password);

        if (!isValidPassword) {
            throw appError("Incorrect password", 400);
        }

        const hash = await bcrypt.hash(newPassword, 10);

        await userModel.updatePassword(id, hash);

        return res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        next(error);
    }
};


const auth = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.getByEmail(email);

        if (!user || !password) {
            throw appError("Incorrect username or password", 400);
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            throw appError("Incorrect username or password", 400);
        }

        const token = CryptoJS.AES.encrypt(JSON.stringify({
            id: user.idUser,
            email: user.email,
            username: user.username,
        }), process.env.CRYPTO_SECRET).toString();

        res.cookie("session", token, {
            httpOnly: true,
            signed: true,
            maxAge: 1 * 1000 * 60 * 60 * 24, // 1 dia
            sameSite: "strict"
        }).json({ message: "User authenticated successfully", user: { userId: user.idUser, name: user.name, email: user.email, username: user.username, bio: user.bio, profilePhoto: user.profilePhotoPath } });

    } catch (error) {
        return next(error);
    }
}

const profile = async (req, res, next) => {
    let { username } = req.params;
    const sessionUsername = req.session.username;
    const userId = req.session.id;

    if (username === "my-profile") {
        username = sessionUsername;
    };

    try {
        const result = await userModel.getByUsername(username);
        const friend = await friendModel.getOneFriend(sessionUsername, username);

        if (!result) {
            throw appError("User not found", 404);
        }

        const friendRequest = await friendModel.getOneFriendRequest(userId, result.idUser);

        return res.status(200).json({
            name: result.name,
            username: result.username,
            bio: result.bio,
            profilePhoto: result.profilePhotoPath,
            isMyProfile: username == sessionUsername,
            isMyFriend: friend ? true : false,
            isFriendRequestSended: friendRequest ? friendRequest.fkSender === userId : false,
            isFriendRequestReceived: friendRequest ? friendRequest.fkReceiver === userId : false
        });

    } catch (error) {
        return next(error);
    }
}


const logout = (req, res) => {
    return res.status(200).clearCookie("session").redirect("/register");
}

const deleteProfile = async (req, res, next) => {
    const { id } = req.session;
    const { password } = req.body;

    try {
        const user = await userModel.getById(id);

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            throw appError("Incorrect password", 400);
        }

        if (user.profilePhotoPath) {
            await fs.promises.rm(path.join(__dirname, "../../uploads/", user.profilePhotoPath));
        }

        await userModel.deleteProfile(id);

        return res.status(200).clearCookie("session").json({ message: "Profile deleted successfully" });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createUser,
    updateProfilePhotoOnUserCreate,
    updateProfile,
    updateProfilePhoto,
    updatePassword,
    auth,
    profile,
    logout,
    deleteProfile
};
const createDto = ({ name, email, username, password, bio }) => {
    const errors = [];

    if (!name || !email || !username || !password) {
        errors.push("The fields 'name', 'email', 'username', and 'password' are required");
    }

    else if (typeof name !== "string") {
        errors.push("The name must be a string");
    }

    else if (typeof email !== "string") {
        errors.push("The email must be a string");
    }

    else if (typeof username !== "string") {
        errors.push("The username must be a string");
    }

    else if (typeof password !== "string") {
        errors.push("The password must be a string");
    }

    else if (bio && typeof bio !== "string") {
        errors.push("The bio must be a string");
    }


    else {
        if (name.length < 3 || name.length > 80) {
            errors.push("The name must be between 3 and 80 characters long");
        }

        if (name.includes("1234567890!@#$%^&*()_-+=[]{}|\\:;\"'<>,.?/")) {
            errors.push("The name cannot contain special characters or numbers");
        }

        if (email.length > 100 || email.length < 5) {
            errors.push("The email must be between 5 and 100 characters long");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push("The email format is invalid");
        }

        if (username.length > 30 || username.length < 3) {
            errors.push("The username must be between 3 and 30 characters long");
        }

        if (username[0] === '@') {
            errors.push("The username cannot start with '@'");
        }

        if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/.test(password)) {
            errors.push("The password must be at least 6 characters long, contain a special character, a number, and an uppercase letter");
        }

        if (bio && bio.length > 200) {
            errors.push("The bio cannot be longer than 200 characters");
        }
    }

    return {
        errors,
        isValid: errors.length === 0
    }
}

module.exports = {
    createDto
};
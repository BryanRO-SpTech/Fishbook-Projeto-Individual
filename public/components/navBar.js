function navBar() {
    const scriptParent = document.currentScript.parentElement;
    const page = document.currentScript.getAttribute("data-page");


    scriptParent.insertAdjacentHTML("beforeend", `
        <header>
    <div class="logo">
        <img src="assets/images/Fishbook.svg" alt="Logo Fishbook">
    </div>

    <a href="/post">
        <div class="create">
            <img src="assets/icons/addBox.svg" alt="Criar Publicação">
            <span>Criar Post</span>
        </div>
    </a>

    <nav>
        <ul>
            <li class="${page == "feed" ? "selected" : ""}">
                <svg viewBox="0 0 45 44" fill="none" xmlns="http://www.w3.org/2000/svg" class="grid">
                    <path d="M18.7619 5.5H5.92859V18.3333H18.7619V5.5Z" stroke="white" stroke-width="4"
                        stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M38.9286 5.5H26.0953V18.3333H38.9286V5.5Z" stroke="white" stroke-width="4"
                        stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M38.9286 25.6667H26.0953V38.5H38.9286V25.6667Z" stroke="white" stroke-width="4"
                        stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M18.7619 25.6667H5.92859V38.5H18.7619V25.6667Z" stroke="white" stroke-width="4"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                <span>Feed</span>
            </li>
            <li class="${page == "pescar" ? "selected" : ""}">
                <svg viewBox="0 0 45 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M39.6577 25.3381C39.6527 25.3028 39.6399 25.269 39.6204 25.2391C39.6008 25.2092 39.5749 25.184 39.5446 25.1652C39.5142 25.1464 39.48 25.1346 39.4446 25.1305C39.4091 25.1264 39.3732 25.1301 39.3393 25.1415C36.8389 25.9709 34.7255 27.6816 33.3934 29.9544C33.3727 29.9957 33.3642 30.0419 33.3688 30.0878C33.3734 30.1337 33.391 30.1773 33.4194 30.2136C33.4479 30.25 33.4861 30.2774 33.5295 30.2929C33.573 30.3083 33.6199 30.3111 33.6649 30.3009L35.3504 29.8889C35.4022 29.8768 35.4566 29.882 35.5053 29.9037C35.5539 29.9255 35.594 29.9626 35.6195 30.0094C35.645 30.0561 35.6545 30.11 35.6465 30.1626C35.6384 30.2153 35.6134 30.2638 35.5751 30.3009L34.9758 30.8908C31.4363 34.0745 30.6873 34.6363 27.4006 34.6363C26.7484 34.641 26.1088 34.457 25.5589 34.1065C25.009 33.7559 24.5722 33.2537 24.3012 32.6605C23.9801 31.8539 23.824 30.991 23.8424 30.123C23.7956 28.0068 23.7488 25.8906 23.7488 23.7838L23.6083 13.8114H28.5149C28.7438 14.1795 29.0864 14.4629 29.4908 14.6189C29.8952 14.7748 30.3395 14.7948 30.7562 14.6758C31.173 14.5567 31.5397 14.3052 31.8007 13.9591C32.0617 13.6131 32.2029 13.1914 32.2029 12.758C32.2029 12.3246 32.0617 11.9029 31.8007 11.5569C31.5397 11.2109 31.173 10.9593 30.7562 10.8402C30.3395 10.7212 29.8952 10.7412 29.4908 10.8971C29.0864 11.0531 28.7438 11.3365 28.5149 11.7046H23.5989C23.5989 10.7682 23.5989 9.83185 23.5989 8.89548C24.6245 8.56117 25.4973 7.87199 26.0603 6.95183C26.6232 6.03167 26.8395 4.94087 26.6703 3.87551C26.501 2.81015 25.9573 1.84009 25.1369 1.13972C24.3165 0.439337 23.2731 0.0545654 22.1944 0.0545654C21.1157 0.0545654 20.0723 0.439337 19.2519 1.13972C18.4314 1.84009 17.8877 2.81015 17.7185 3.87551C17.5492 4.94087 17.7655 6.03167 18.3285 6.95183C18.8915 7.87199 19.7642 8.56117 20.7898 8.89548C20.7898 9.83185 20.7898 10.7682 20.7898 11.7046H15.7522C15.5232 11.3365 15.1806 11.0531 14.7762 10.8971C14.3718 10.7412 13.9276 10.7212 13.5108 10.8402C13.094 10.9593 12.7274 11.2109 12.4663 11.5569C12.2053 11.9029 12.0641 12.3246 12.0641 12.758C12.0641 13.1914 12.2053 13.6131 12.4663 13.9591C12.7274 14.3052 13.094 14.5567 13.5108 14.6758C13.9276 14.7948 14.3718 14.7748 14.7762 14.6189C15.1806 14.4629 15.5232 14.1795 15.7522 13.8114H20.6494L20.5089 23.7838C20.5089 25.9 20.4621 28.0068 20.4246 30.123C20.4398 30.9916 20.2806 31.8545 19.9565 32.6605C19.6881 33.2537 19.2532 33.7562 18.7046 34.1069C18.1561 34.4577 17.5175 34.6416 16.8664 34.6363C13.5704 34.6363 12.8213 34.0745 9.28185 30.8908L8.7013 30.329C8.66303 30.2919 8.63796 30.2434 8.62994 30.1907C8.62192 30.1381 8.63138 30.0842 8.65689 30.0375C8.68239 29.9907 8.72253 29.9536 8.77114 29.9318C8.81975 29.9101 8.87416 29.9049 8.92603 29.917L10.6115 30.329C10.6565 30.3392 10.7034 30.3364 10.7469 30.321C10.7903 30.3055 10.8285 30.278 10.857 30.2417C10.8854 30.2054 10.903 30.1618 10.9076 30.1159C10.9122 30.07 10.9037 30.0238 10.883 29.9825C9.54325 27.7092 7.41854 26.0041 4.909 25.1883C4.87572 25.1768 4.84029 25.173 4.80533 25.1772C4.77038 25.1813 4.7368 25.1933 4.70711 25.2122C4.67741 25.231 4.65236 25.2564 4.63382 25.2863C4.61527 25.3162 4.60372 25.3499 4.6 25.3849C4.45018 26.4899 4.03818 30.5912 5.53637 32.8759C5.56668 32.9073 5.60489 32.93 5.64699 32.9416C5.68909 32.9532 5.73353 32.9533 5.77566 32.9418C5.81778 32.9303 5.85605 32.9077 5.88643 32.8763C5.91682 32.845 5.93821 32.806 5.94837 32.7635L6.46338 31.4713C6.48021 31.424 6.5113 31.383 6.55238 31.354C6.59345 31.325 6.6425 31.3094 6.69279 31.3094C6.74307 31.3094 6.79212 31.325 6.8332 31.354C6.87428 31.383 6.90537 31.424 6.9222 31.4713C7.44656 33.007 9.37549 36.8461 15.8739 39.7114C16.108 39.7957 20.7524 41.4062 21.8854 43.8033C21.9078 43.8487 21.9425 43.887 21.9855 43.9137C22.0285 43.9404 22.0782 43.9546 22.1288 43.9546C22.1795 43.9546 22.2291 43.9404 22.2721 43.9137C22.3152 43.887 22.3499 43.8487 22.3723 43.8033C23.5147 41.4062 28.1591 39.7957 28.3838 39.7114C34.8916 36.8461 36.8111 33.007 37.3448 31.4713C37.3633 31.427 37.3945 31.3891 37.4345 31.3624C37.4745 31.3358 37.5215 31.3215 37.5696 31.3215C37.6176 31.3215 37.6646 31.3358 37.7046 31.3624C37.7446 31.3891 37.7758 31.427 37.7943 31.4713C37.9628 31.8833 38.1688 32.4077 38.3093 32.7635C38.33 32.8027 38.361 32.8356 38.3989 32.8585C38.4369 32.8814 38.4803 32.8935 38.5247 32.8935C38.569 32.8935 38.6125 32.8814 38.6504 32.8585C38.6884 32.8356 38.7194 32.8027 38.74 32.7635C40.2382 30.5443 39.8262 26.443 39.6577 25.3381ZM22.1382 6.43283C21.7678 6.43283 21.4057 6.32299 21.0978 6.11722C20.7898 5.91144 20.5498 5.61895 20.408 5.27676C20.2663 4.93456 20.2292 4.55801 20.3014 4.19474C20.3737 3.83146 20.5521 3.49777 20.814 3.23586C21.0759 2.97396 21.4096 2.7956 21.7728 2.72334C22.1361 2.65108 22.5127 2.68816 22.8549 2.8299C23.1971 2.97165 23.4895 3.21168 23.6953 3.51965C23.9011 3.82762 24.0109 4.1897 24.0109 4.56009C24.0109 5.05677 23.8136 5.53311 23.4624 5.88432C23.1112 6.23552 22.6349 6.43283 22.1382 6.43283Z"
                        fill="white" />
                </svg>

                <span>Pescar</span>
            </li>
            <li class="${page == "catalogo" ? "selected" : ""}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#FFF" class="bi bi-book" viewBox="0 0 16 16">
                    <path
                        d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
                </svg>

                <span>Catálogo</span>
            </li>
        </ul>
    </nav>

    <div class="search">
        <input type="text" placeholder="Pesquisar">
        <img src="assets/icons/search.svg" alt="Lupa">
    </div>

    <div class="notification">
        <div class="counter">99</div>
    </div>

    <div class="profile" style="background-image: url(assets/images/loginRegisterBackground.png);"></div>
</header>
    
    
    `);
}


navBar();
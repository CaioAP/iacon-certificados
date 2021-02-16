<template>
    <div id="nav" class="nav">
        <link
            href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
            rel="stylesheet"
            type="text/css"
        />
        <div class="nav-item">
            <img :src="logoSoma" class="logo" id="logo-soma" />

            <router-link :to="{ name: 'Documentos' }"> Documentos </router-link>

            <router-link :to="{ name: 'Usuario' }">
                Cadastro de Usuários
            </router-link>
        </div>

        <img :src="logoIacon" class="logo" id="logo-iacon" />
        <div id="user-menu" class="user-menu">
            <div class="user-menu-link" id="user-menu-link" >Sair</div>
        </div>
    </div>
</template>

<script>
import LogoIacon from '@/assets/logo-iacon.png'
import LogoSoma from '@/assets/logo-soma.webp'
import { AUTH_LOGOUT } from '../store/actions/auth'
export default {
    computed: {
        logoIacon() {
            return LogoIacon
        },
        logoSoma() {
            return LogoSoma
        },
    },
    methods: {
        logout: function () {
            this.$store
                .dispatch(AUTH_LOGOUT)
                .then(() => {
                    this.$router.push('/documentos')
                })
                .catch(() => {
                    this.alertLogin = true
                })
        },
    },
    mounted() {
        document.addEventListener('mouseup', function (e) {
            var ctxMenu = document.getElementById('user-menu')
            if (!ctxMenu.contains(e.target)) {
                ctxMenu.style.display = 'none'
            }
        })

        document.getElementById('logo-iacon').addEventListener(
            'contextmenu',
            function (e) {
                e.preventDefault()
                var ctxMenu = document.getElementById('user-menu')
                ctxMenu.style.display = 'block'
                ctxMenu.classList.add(
                    'animate__animated',
                    'animate__fadeInDown',
                    'animate__faster'
                )
            },
            false
        )

        const dispatcher = this.$store.dispatch;
        document.getElementById('user-menu-link').addEventListener(
            'click',
            function (e) {
                e.preventDefault();
                dispatcher(AUTH_LOGOUT);
            },
            false
        )
    },
}
</script>

<style lang="scss" scoped>
@font-face {
    font-family: proximaNovaRegular;
    src: url(../fonts/ProximaNovaRegular.ttf) format('truetype');
}
div#nav {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    background-color: #001245;
    padding: 0px;
    min-height: 60px;
    margin-bottom: 16px;
    box-shadow: 0px 2px 4px 0px #888888;
    font-style: proximaNovaRegular;

    div.nav-item {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        min-height: 60px;
    }

    a {
        margin: 0px 12px;
        // color: #2c3e50;
        color: #fff;
        padding-bottom: 11px;

        &.router-link-exact-active {
            border-bottom: 3px solid #fff;
            padding-bottom: 8px;
            font-weight: bold;
        }
    }
    a:hover {
        text-decoration: none;
    }
    div.user-menu {
        position: absolute;
        background-color: rgba(255, 255, 255, 1);
        width: 10rem;
        height: 4rem;
        top: 2.4rem;
        right: 0.2rem;
        box-shadow: -0.01em 0.01em 0.3em rgba(100, 100, 100, 1);
        display: none;

        :hover {
            cursor: pointer;
        }

        div.user-menu-link {
            margin: 0px 12px;
            display: block;
            margin-top: 0.8rem;
            color: #666;
            font-weight: 700;
        }
    }

    img.logo {
        max-width: 12rem;
        margin: auto 0.75rem;
    }
    img#logo-iacon {
        max-width: 6rem;
    }
}
</style>

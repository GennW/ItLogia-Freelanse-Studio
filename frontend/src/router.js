import { Dashboard } from "./components/dashboard";
import { Login } from "./components/login";
import { SignUp } from "./components/sign-up";

document.addEventListener("DOMContentLoaded", function () {

});
export class Router {

    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.adminlteStyleElement = document.getElementById('adminlte_style');



        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Дашборд',
                filePathTemplate: '/templates/dashboard.html',
                uselayout: '/templates/layout.html',
                load: () => {
                    new Dashboard();
                }
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/404.html',
                uselayout: false,
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/login.html',
                uselayout: false,
                load: () => {
                    document.body.classList.add('login-page'); //выравнивание блока по центру
                    document.body.style.height = '100vh';
                    new Login();
                },
                unload: () => {
                    document.body.classList.remove('login-page');
                    document.body.style.height = 'auto';
                },
                styles: ['icheck-bootstrap.min.css'],
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/sign-up.html',
                uselayout: false,
                load: () => {
                    document.body.classList.add('register-page'); //выравнивание блока по центру
                    document.body.style.height = '100vh';
                    new SignUp();
                },
                unload: () => {
                    document.body.classList.remove('register-page');
                    document.body.style.height = 'auto';
                },
                styles: ['icheck-bootstrap.min.css'],
            },
        ]
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));

        // SPA без  # 43 минута
        document.addEventListener('click', this.openNewRoute.bind(this));
    }
    async openNewRoute(e, oldRoute = null) {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }

        if (element) {
            e.preventDefault();

            const url = element.href.replace(window.location.origin, ''); // URL относительно корня домена (http://localhost:9000/) без указания полного URL.
            if (!url || url === '/#' || url.startsWith('javascript:void(0)')) {
                return;
            }

            const currentRoute = window.location.pathname; // 1:03

            history.pushState({}, '', url); // чтобы не перезагружать страницы при нажатии на стрелки
            await this.activateRoute(null, currentRoute); // параметры 1.04 видео часть 3
        }
    }
    // конец SPA без  # 43 минута



    async activateRoute(e, oldRoute = null) {

        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute); // получаем старый роут с которого уходим

            // удаление стиля только для определенных страниц  1:06 видео
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    document.querySelector(`link[href='/css/${style}']`).remove();
                });
            }

            if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                currentRoute.unload();
            }
        }


        const utlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === utlRoute);

        if (newRoute) {
            // подключение стиля только для определенных страниц  29мин
            if (newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach(style => {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = '/css/' + style;
                    document.head.insertBefore(link, this.adminlteStyleElement);
                });
            }

            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Freelance Studio';
            }

            if (newRoute.filePathTemplate) {
                // document.body.className = ''; //очищаем классы при переходе на новую страницу
                // 1:41:50 блок ниже можно переписать оптимизация
                let contentBlock = this.contentPageElement;
                if (newRoute.uselayout) {
                    // Если установлен флаг newRoute.uselayout, загружаем содержимое страницы из указанного макета
                    this.contentPageElement.innerHTML = await fetch(newRoute.uselayout)
                        .then(response => response.text());
                    contentBlock = document.getElementById('content-layout');

                    // для переключения стилей при сворачивании сайдбара
                    document.body.classList.add('sidebar-mini');
                    document.body.classList.add('layout-fixed');
                } else {
                    // для переключения стилей при сворачивании сайдбара
                    document.body.classList.remove('sidebar-mini');
                    document.body.classList.remove('layout-fixed');
                }
                // Загружаем содержимое страницы из указанного шаблона файла пути
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate)
                    .then(response => response.text());
            }


            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }

        } else {
            console.log('No route found');
            history.pushState({}, '', '/404'); // чтобы не перезагружать страницы при нажатии на стрелки
            await this.activateRoute();
        }
    }
}
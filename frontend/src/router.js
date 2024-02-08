import { Dashboard } from "./components/dashboard";
import { Login } from "./components/login";
import { SignUp } from "./components/sign-up";

export class Router {

    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');


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
                    new Login();
                }
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/sign-up.html',
                uselayout: false,
                load: () => {
                    new SignUp();
                }
            },
        ]
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
    }

    async activateRoute() {
        const utlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === utlRoute);

        if (newRoute) {
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Freelance Studio';
            }

            if (newRoute.filePathTemplate) {
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
            window.location = '/404';
        }
    }
}
<?php

// Load the composer required libraries
require "vendor/autoload.php";

// Load the framework
$f3 = Base::instance();

$f3->config("config.ini");
// Database connection information
$f3->config("access.ini");

// Routes
// index.html
$f3->route("GET @home: /", "LoginController->render");
$f3->route("POST @home: /", "LoginController->login");
$f3->route("GET @register: /register", "RegisterController->render");
$f3->route("POST @register: /register", "RegisterController->register");

// contact-us.html
$f3->route("GET @contactUs: /contact-us", "PagesController->contactUs");

// main.html
$f3->route("GET @main: /app", "PagesController->app");


// Start
$f3->run();

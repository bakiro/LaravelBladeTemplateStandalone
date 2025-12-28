<!DOCTYPE html>
{{--
    Para compatibilidad fuera de Laravel, se usa la variable $lang pasada desde PHP.
    En Laravel, puedes reemplazar por: <html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
--}}
<html lang="{{ isset($lang) ? $lang : 'es' }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Laravel Template')</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    @include('partials.navbar')
    <main>
        @yield('content')
    </main>
    @include('partials.footer')
</body>
</html>

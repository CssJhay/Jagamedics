jQuery(document).ready(function ($) {
    "use strict";
    $('a[data-rel]').each(function () {
        $(this).attr('rel', $(this).data('rel'));
    });
    if ($('.gallery').length) {
        $(".gallery:first a[rel^='prettyPhoto']").prettyPhoto({
            animation_speed: 'normal',
            theme: 'light_square',
            slideshow: 3000,
            autoplay_slideshow: true
        });
        $(".gallery:gt(0) a[rel^='prettyPhoto']").prettyPhoto({
            animation_speed: 'fast',
            slideshow: 10000,
            hideflash: true
        });
    }
    if ($('#home-banner').length) {
        $("#home-banner").owlCarousel({
            navigation: true,
            slideSpeed: 300,
            paginationSpeed: 400,
            autoPlay: true,
            autoplayTimeout: 1000,
            singleItem: true
        });
    }
    if ($('#home-banner-3').length) {
        $("#home-banner-3").owlCarousel({
            navigation: true,
            slideSpeed: 300,
            paginationSpeed: 400,
            autoPlay: true,
            transitionStyle: "fade",
            autoplayTimeout: 1000,
            singleItem: true
        });
    }
    if ($('#blog-post').length) {
        $("#blog-post").owlCarousel({
            navigation: true,
            slideSpeed: 300,
            paginationSpeed: 400,
            autoPlay: true,
            autoplayTimeout: 1000,
            singleItem: true
        });
    }
    if ($('.priorities-slider').length) {
        $(".priorities-slider").owlCarousel({
            navigation: true,
            items: 3,
            loop: true,
            margin: 30,
            itemsCustom: false,
            itemsDesktop: [1199, 2],
            itemsDesktopSmall: [979, 2],
            itemsTablet: [768, 2],
            itemsTabletSmall: false,
            itemsMobile: [479, 1],
            singleItem: false,
            itemsScaleUp: false,
        });
    }
    if ($('.project-slider').length) {
        $(".project-slider").owlCarousel({
            navigation: true,
            items: 3,
            loop: true,
            margin: 30,
            itemsCustom: false,
            itemsDesktop: [1199, 2],
            itemsDesktopSmall: [979, 2],
            itemsTablet: [768, 1],
            itemsTabletSmall: false,
            itemsMobile: [479, 1],
            singleItem: false,
            itemsScaleUp: false,
        });
    }
    if ($('.features-slider').length) {
        $(".features-slider").owlCarousel({
            navigation: true,
            items: 3,
            loop: true,
            margin: 30,
            itemsCustom: false,
            itemsDesktop: [1199, 2],
            itemsDesktopSmall: [979, 2],
            itemsTablet: [768, 2],
            itemsTabletSmall: false,
            itemsMobile: [479, 1],
            singleItem: false,
            itemsScaleUp: false,
        });
    }
    if ($('.timeline-slider').length) {
        $(".timeline-slider").owlCarousel({
            navigation: true,
            items: 6,
            loop: true,
            margin: 30,
            itemsCustom: false,
            itemsDesktop: [1199, 2],
            itemsDesktopSmall: [979, 2],
            itemsTablet: [768, 2],
            itemsTabletSmall: false,
            itemsMobile: [479, 1],
            singleItem: false,
            itemsScaleUp: false,
        });
    }
    if ($('.progressbars').length) {
        $(".progressbars").jprogress();
        $(".progressbarsone").jprogress({});
    }
    if ($('.counter').length) {
        $('.counter').counterUp({
            delay: 10,
            time: 1000
        });
    }
    if ($('#post-slider').length) {
        $("#post-slider").owlCarousel({
            navigation: true,
            slideSpeed: 300,
            paginationSpeed: 400,
            autoPlay: true,
            autoplayTimeout: 1000,
            singleItem: true
        });
    }
    if ($('#testimonials-1').length) {
        $("#testimonials-1").owlCarousel({
            navigation: true,
            slideSpeed: 300,
            paginationSpeed: 400,
            autoPlay: true,
            autoplayTimeout: 1000,
            singleItem: true
        });
    }
    if ($('#testimonials-01').length) {
        $("#testimonials-01").owlCarousel({
            navigation: true,
            items: 2,
            loop: true,
            margin: 30,
            itemsCustom: false,
            itemsDesktop: [1199, 2],
            itemsDesktopSmall: [979, 2],
            itemsTablet: [768, 2],
            itemsTabletSmall: false,
            itemsMobile: [479, 1],
            singleItem: false,
            itemsScaleUp: false,
        });
    }
    if ($('.team-slider').length) {
        $(".team-slider").owlCarousel({
            navigation: true,
            items: 2,
            loop: true,
            margin: 30,
            itemsCustom: false,
            itemsDesktop: [1199, 2],
            itemsDesktopSmall: [979, 2],
            itemsTablet: [768, 2],
            itemsTabletSmall: false,
            itemsMobile: [479, 1],
            singleItem: false,
            itemsScaleUp: false,
        });
    }
    if ($('.defaultCountdown').length) {
        var austDay = new Date();
        austDay = new Date(austDay.getFullYear() + 1, 1 - 1, 26);
        $('.defaultCountdown').countdown({
            until: austDay
        });
        $('#year').text(austDay.getFullYear());
    }
    if ($('#event-banner').length) {
        $("#event-banner").owlCarousel({
            navigation: true,
            slideSpeed: 300,
            paginationSpeed: 400,
            autoPlay: true,
            autoplayTimeout: 1000,
            singleItem: true
        });
    }
    if ($('.bxslider').length) {
        $('.bxslider').bxSlider({
            pagerCustom: '#bx-pager'
        });
    }
    if ($(".cp-gallery-metro-2 .isotope").length) {
        var $container = $('.cp-gallery-metro-2 .isotope');
        $container.isotope({
            itemSelector: '.item',
            transitionDuration: '0.6s',
            masonry: {
                columnWidth: $container.width() / 12
            },
            layoutMode: 'masonry'
        });
        $(window).resize(function () {
            $container.isotope({
                masonry: {
                    columnWidth: $container.width() / 12
                }
            });
        });
    }
    if ($(".cp-gallery-metro-1 .isotope").length) {
        var $container = $('.cp-gallery-metro-1 .isotope');
        $container.isotope({
            itemSelector: '.item',
            transitionDuration: '0.6s',
            masonry: {
                columnWidth: 3
            },
            layoutMode: 'masonry'
        });
        $(window).on('resize', function (e) {
            $container.isotope({
                masonry: {
                    columnWidth: $container.width() / 12
                }
            });
        });
    }
    if ($('#map_contact_1').length) {
        var map;
        var myLatLng = new google.maps.LatLng(51.507351, -0.127758);
        var myOptions = {
            zoom: 12,
            center: myLatLng,
            zoomControl: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            styles: [{
                stylers: [{
                    hue: '#cacaca'
                }, {
                    saturation: -100,
                }, {
                    lightness: 10
                }]
            }],
        }
        map = new google.maps.Map(document.getElementById('map_contact_1'), myOptions);
        var marker = new google.maps.Marker({
            position: map.getCenter(),
            map: map,
            icon: 'images/map-icon-2.png'
        });
        marker.getPosition();
        var map = new google.maps.Map(document.getElementById('map-canvas'), {
            zoom: 7,
            center: new google.maps.LatLng(originalLocation[0], originalLocation[1]),
            scrollwheel: false
        });
    }
});
// 
// A $( document ).ready() block.
jQuery(document).ready(function ($) {
    $(function () {
        $('#profile-image').on('click', function () {
            $('#profile-image-upload').click();
        });
    });
});

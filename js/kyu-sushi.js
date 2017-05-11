(function(_win, $) {
    var $body = $('body'),
        $win = $(_win),
        $foodArr = [],
        $bottomBuffer = 30;

    //twitter obj
    var displayTwitterObj = {
        twitterShoBool: false,
        displayTwitter: function(_obj) {
            var $myDate = new Date(_obj.date),
                $day = $myDate.getDay(),
                $mon = $myDate.getMonth(),
                $date = $myDate.getDate(),
                $year = $myDate.getFullYear(),
                $dayStr = '',
                $fullDateStr = '';
                $year = $year.toString();
                $year = $year.replace('20', '');
            switch ($day) {
                case 0:
                    $dayStr = 'Sunday';
                    break;
                case 1:
                    $dayStr = 'Monday';
                    break;
                case 2:
                    $dayStr = 'Tuesday';
                    break;
                case 3:
                    $dayStr = 'Wednesday';
                    break;
                case 4:
                    $dayStr = 'Thursday';
                    break;
                case 5:
                    $dayStr = 'Friday';
                    break;
                case 6:
                    $dayStr = 'Saturday';
                    break;
            };
            // $mon = parseInt($mon++);
            _obj.date = $mon + '/' + $date + '/' + $year;
            _obj.day = $dayStr;

            var $str = '<div class="tweet-wrap">';
            $str +=
                '<div class="tweet-date"><p class="date-tweet"><span class="bold black">{{day}}</span><br/>{{date}}</p></div>';
            $str += '<div class="tweet-content">';
            $str +=
                '<p class="tweet-txt"><span class="tweet-icon"></span><Kyu SSam<br/>{{tweet}}</p>';
            $str += '</div></div>';

            return Mustache.to_html($str, _obj);
        },
        //* list the tweets in a ul list
        listTweets: function(_arr) {
            $('.tweet-wrap-inner').empty();
            $.each(_arr, function(i) {
                $('.tweet-wrap-inner').append(displayTwitter({
                    "tweet": _arr[i].text,
                    "date": _arr[i].created_at
                }));
            });
        },

        $timer: null,
        $interval: 10000,
        $functSetTimer: function(_bool, _interval) {
            if (_interval !== null) {
                this.$interval = _interval;
            };
            if (_bool) {
                this.$timer = setInterval(function() {
                    $.getJSON(
                        'kyussam-tweets/tweets_json.php?count=10',
                        function(data) {
                            listTweets(data);
                        });
                }, displayTwitterObj.$interval);
                return;
            };

            clearInterval(this.$timer);
            this.$timer = null;
            this.$interval = 10000;
            return;
        },
        //toggle the twitter bubble
        toggleShowTweet: function(_bool) {
            clearInterval(this.$timer);
            if (_bool) {
                this.$functSetTimer(true, 5000);
                setTimeout(function() {
                    $('.tweet-wrapper,.twitter-link').addClass('sho')
                }, 2000);
                return;
            };
            $('.tweet-wrapper,.twitter-link').removeClass('sho');

            this.$functSetTimer(false, 2000);
            return;
        }
    };
    //*get the doc height
    function getDocHeight() {
        var $doc = document;
        return Math.max($doc.body.scrollHeight, $doc.documentElement.scrollHeight,
            $doc.body.offsetHeight, $doc.documentElement.offsetHeight,
            $doc.body.clientHeight, $doc.documentElement.clientHeight
        );
    };
    //* scroll to the top
    function scrollTopAnim(_bool) {
        $('html,body').animate({
            scrollTop: 0
        }, 200);
        $('window').scrollTop(0);
        return _bool;
    };
    //*make sure the bottom blocks are the same height;
    function setBottomHeight() {
        var $bottomBlock = $('.bottom-block'),
            $bottomHeight = 0;
        $.each($bottomBlock, function(i) {
            if ($bottomBlock.eq(i).height() > $bottomHeight) {
                $bottomHeight = $(this).height() + $bottomBuffer;
            };
        });
        $bottomBlock.css({
            'height': $bottomHeight + 'px',
            'minHeight': $bottomHeight,
            'paddingBottom': '8px'
        });
    };
    //* set the height of the menu modal //
    function setMenuHeight(_menu, _bool) {
        var $height = $(_menu).height();
        $height = parseInt($height - 100);
        $height = ($height + 100);
        if (_bool) {
            setFadeHeight($height, false);
        };
    };
    //* set the height of lightbox fade
    function setFadeHeight(_height, _bool) {
        $('#fade_bg').css({
            'minHeight': (_height - 100),
            'height': _height,
            'maxHeight': (_height + 100)
        });
        return _bool;
    };
    //show full menu
    function displayMenu() {
        $body.one(
            "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
            function(_obj) {
                $body.removeClass('ready').addClass('showMenu');
            });
        setFadeHeight($('#menu_full_wrapper').height(), null);
        $body.addClass('showFade');
    };
    //* get html string of food desc
    function getFoodDesc(_index) {
        var $str = '<span class="title">{{name}}</span><br/><span class="desc">{{desc}}</span>',
            $obj = $('.icon-pop-food' + _index).data('text');

        return Mustache.to_html($str, $obj);
    };
    //* show food photo in modal screen
    function displayFoodImage(_box, _bool) {
        var $box = $(_box),
            $index = $box.index(),
            $scn = $('#display_screen');

        if (_bool) {
            $scn.css({
                backgroundImage: $box.css('backgroundImage')
            }).addClass('blur').removeClass('act-desc');
        };
        /* set the display of food item selected */
        $('#display_screen').find('.txt-desc').html(getFoodDesc($index));
        var $bg = $('.icon-pop-food' + $index).data('src');
        $('.icon-pop-food.active').removeClass('active');

        $box.addClass('active');
        if (setFadeHeight(getDocHeight(), true)) {
            $scn.css({
                backgroundImage: 'url(' + $bg + ')'
            }).removeClass('blur').addClass('act-desc');
        };
    };

    /* CHECK HASH TAG ON THE URL FOR MENU DIRECT */
    function checkHashUrl() {
        var $url = window.location;
        $url = $url.toString();
        if ($url.indexOf('/menu.html') !== -1) {
            window.location = "http://www.kyussam.com/#!/menu";
            return;
        };
        if ($url.indexOf('/#!/menu') !== -1 || $url.indexOf('/menu') !== -1) {
            setTimeout(function() {
                $('body').removeClass('ready').addClass('showFade').addClass('showMenu')
            }, 200);
            return;
        };
    };
    //*CHECK TO SEE IF USER GOES DIRECTLY TO MENU *//
    checkHashUrl();

    /* CHECK TO SEE IF ELEMENT IS VISIBLE ON THE PAGE */
    function checkVisibility(_item) {
        return ((_item.is(':visible') || _item.height() > 3) ? true : false);
    };

    /* DYNAMICALLY CREATE MODAL FROM MUSTACHE TEMPLATE */
    function createModalkyuMenu(_arr, _type) {
        var $str = '<dt><span class="price">${{price}}</span><span class="mName">{{name}}</span></dt><dd>{{desc}}</dd>',
            $htm = '';
        $.each(_arr, function(i) {
            $htm += Mustache.to_html($str, _arr[i]);
        });

        $('#dl_' + _type).html($htm);
    };
    /* INITIALIZE THE SCREEN */
    function init() {
        $('.icon-pop-food').each(function(i) {
            $('.box-photo').eq(i).css({
                backgroundImage: 'url(imgs/food/icon/icon' + i + '.png)'
            }).find('.box-photo-inner').empty();
        });

        $win.on('scroll resize', function(e) {
            /* check scrolls window*/
            if (e.type === 'scroll') {
                var $scrollPos = $(e.target).scrollTop();
                if ($scrollPos > 30) {
                    $('footer').addClass('fixed');
                };
                if ($scrollPos < 30) {
                    $('footer').removeClass('fixed');
                    $('.tweet-wrapper,.twitter-link').removeClass('sho');
                    displayTwitterObj.toggleShowTweet(false);
                };
            };
            /* check resize indow*/
            if (e.type === 'resize') {
                setBottomHeight();
            }

            return;
        });
        // item to click = photo div
        $('.box-photo').on('click', function() {
            var $box = $(this);
            $('.box-photo.active').removeClass('active');
            $box.addClass('active');

            scrollTopAnim(false);
            /*set the true large size image */
            $('#display_screen').css({
                    'backgroundImage': 'url(imgs/food/full/photo' + $box.index() + '.png)'
                })
                .find('.txt-desc')
                .html(getFoodDesc($box.index()));

            $body.addClass('popOpen').find('.icon-pop-food' + $box.index()).trigger('click');
        });
        // item to click = all links;
        $body.find('a').on('click', function(e) {
            e.preventDefault();
            var $this = $(this),
                dto = displayTwitterObj;

            if ($this.hasClass('twitter-link')) {
                dto.twitterShoBool = true;
                $('.tweet-wrapper,.twitter-link').toggleClass('sho');
                dto.toggleShowTweet($('.tweet-wrapper').hasClass('sho'));

                return false;
            };
            /* user clicks on the item that is already active */
            if ($this.hasClass('on') || $this.hasClass('active')) {
                return false;
            };
            /* user clicks on the close popup */
            if ($this.hasClass('link-close')) {
                $body.removeClass('popOpen');
                $('.box-photo.active').removeClass('active');
                return false;
            };
            /* user clicks on the close popup */
            if ($this.hasClass('link-close-win')) {
                $body.removeClass('showMenu').removeClass('showFade').addClass('ready');
                return false;
            };

            /* user clicks on food box items */
            if ($this.hasClass('icon-pop-food')) {
                var $this = $(this);
                if (scrollTopAnim(true)) {
                    /*LAZY LOAD LARGE PNG FILE FROM DATA SRC*/
                    $('<img src="' + $this.data('src') + '"/>').on('load', function() {
                        displayFoodImage($this, true);
                    });
                };

                return false;
            };

            /* user clicks on outside link */
            if ($this.hasClass('link-href')) {
                if ($this.attr('target') === '_blank') {
                    window.open($this.attr('href'));
                    return false;
                }
                window.location = $this.attr('href');
                return false;
            };
            if ($this.hasClass('link-scroll-top')) {
                return scrollTopAnim(false);
            };
        });

        // item to click = all buttons
        $('button').on('mouseenter mouseleave click', function(e) {
            var $ready = $('.home-photo-wrapper'),
                $boxphotoLen = $('.box-photo').length,
                $btn = $(this);

            if (e.type === 'mouseenter') {
                $ready.addClass('btn-hover');
            } else if (e.type === 'mouseleave') {
                $ready.removeClass('btn-hover');
            } else if (e.type === 'click') {
                e.preventDefault();

                /*user clicks on phone number*/
                /*open phone dial*/
                if ($btn.hasClass('button-phone')) {
                    window.location = "tel:773-772-5985"
                    return false;
                }
                /*user clicks to view menu modal */
                if ($btn.hasClass('button-view')) {
                    if (scrollTopAnim(true)) {
                        displayMenu();
                    }
                    return false;
                };
                /*user clicks to place an order */
                if ($btn.hasClass('button-order')) {
                    // https://www.grubhub.com/restaurant/kyu-ssam-939-n-ashland-ave-chicago/286759
                    window.open(
                        'https://www.grubhub.com/restaurant/kyu-ssam-939-n-ashland-ave-chicago/286759'
                    );
                    return false;
                };
                /*user clicks to change food photo in modal */
                if ($btn.hasClass('btn-direction')) {
                    var $this = $(this),
                        $index = parseInt($('.icon-pop-food.active').attr('id').replace('food', ''));
                    if ($this.hasClass('btn-direction-prev')) {
                        $index--;
                        if ($index < 0) {
                            $index = ($boxphotoLen - 1);
                        }
                    } else {
                        $index++;
                    }
                    if ($index >= $boxphotoLen) {
                        $index = 0;
                    }
                    //showFoodDisplay($photo,false);
                    $('#food' + $index).trigger('click');
                    return false;
                };
            };
        });
        //*MAKE SURE THE BOXES AT THE BOTTOM ALIGN *//
        setBottomHeight();



        //*LOAD BIG HOMEPAGE BG IMAGE *//
        $('<img src="imgs/home-bg.png"/>').on('load', function() {
            $body.addClass('ready');
        });
    };

    //** Load menu json
    (function loadJson() {
        var $menuArr = [],
            $tempArr = [],
            $type = '';

        $.ajax({
            dataType: "json",
            url: 'json/kyuMenu.json',
            async: false,
            success: function(data) {
                $menuArr = data.menu;
                $foodArr = data.food;
            }
        });
        $.each($menuArr, function(i) {
            switch (i) {
                case 0:
                    $type = 'small';
                    $tempArr = $menuArr[i].small;
                    break;
                case 1:
                    $type = 'beverage';
                    $tempArr = $menuArr[i].beverage;
                    break;
                case 2:
                    $type = 'ceviche';
                    $tempArr = $menuArr[i].ceviche;
                    break;
                case 3:
                    $type = 'soup';
                    $tempArr = $menuArr[i].soupSalad;
                    break;
                case 4:
                    $type = 'korean';
                    $tempArr = $menuArr[i].korean;
                    break;
                case 5:
                    $type = 'taco';
                    $tempArr = $menuArr[i].taco;
                    break;
                case 6:
                    $type = 'combo';
                    $tempArr = $menuArr[i].combo;
                    break;
                case 7:
                    $type = 'alacarte';
                    $tempArr = $menuArr[i].alacarte;
                    break;
                case 8:
                    $type = 'signature';
                    $tempArr = $menuArr[i].signature;
                    break;
                case 9:
                    $type = 'traditional';
                    $tempArr = $menuArr[i].traditional;
                    break;
            };
            createModalkyuMenu($tempArr, $type);
        });

        setMenuHeight($('#menu_full_wrapper'), false);

        /* POPULATE ARRAY WITH FOOD DATA */
        $.each($foodArr, function(i) {
            $('.icon-pop-food').eq(i).data("text", {
                name: $foodArr[i].name,
                desc: $foodArr[i].desc
            });
        });
    }());

    init();

}(window, jQuery));

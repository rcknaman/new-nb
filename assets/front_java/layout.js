{





    let anchorTag = function () {
        $('a').click(function (e) {
            e.preventDefault();
        });
    }
    anchorTag();

    let initiateChat = function () {

        let user = $('#friends li');
        let chatHeader = $('#chat-container>div').first();
        $(' .msg-add-friend', user).click(function (e) {

            $(chatHeader).css({
                'background-color': '#0A58CA',
                'color': "white"
            });
            $(' p', chatHeader).css('left', '10px');
            let userName = $(' .profile-btn', $(this).parent()).text()+' '+'<i class="fas fa-angle-down"></i>';
            $(' p', chatHeader).fadeOut(200, function () {
                $(this).html(userName).fadeIn(500);
            });
            $('#chat-container .chats-container').html(

                `<ul id="chats">
                <li class="self-msg">
                  <div class="username"><p>You</p></div>
                  <div class="msg-content"><p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsum a fuga rerum eligendi sit necessitatibus placeat, nesciunt neque, error quaerat magnam eum, quod similique natus? Corporis repellat vitae in facilis.</p></div>
                </li>
                <li class="self-msg">
                  <div class="username"><p>You</p></div>
                  <div class="msg-content"><p>hi there!2</p></div>
                </li>
                </ul>
                <form id="create-msg">
                    <div id="input-msg"><input type="text" placeholder="text here..."></div>
                    <div id="send-msg"><button type="submit"><i class="fas fa-angle-double-right"></i></button></div>
                </form>`


            )
        });
    }

    let responsive=function(){


        $(window).resize(function(){
            if($(window).width()<=450){
                $('#logo-container a').html(`<i class="fas fa-praying-hands"></i>`);
            }else{
                $('#logo-container a').html(`<img src="/images/finalgif.gif" alt="">`);
            }
        })
    }
    // console.log(document.getElementById('chat-container').getElementsByClassName('fa-angle-down')[0])
    console.log(`$('#chat-container .heading .fa-angle-down'): `,$('#chat-container .heading'));
    console.log(($('#chat-container>div').first().html()));
    // $(document).ready(function(){


        $(document).on('click','#chat-container .heading i',function(e){

            console.log($(this));
            $('#chat-container .chats-container').toggleClass('minimize-chat-body');
            // $('#chat-container').css('height','30px');
            $('#chat-container').toggleClass('minimize-chat-container');
            $(this).toggleClass("fa-angle-up fa-angle-down");
        });

    // });


    responsive();
    initiateChat();
}
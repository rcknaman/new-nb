{let i=function(){$("a").click(function(i){i.preventDefault()})};i();let t=function(){var i=$("#friends li");let e=$("#chat-container>div").first();$(" .msg-add-friend",i).click(function(i){$(e).css({"background-color":"#0A58CA",color:"white"}),$(" p",e).css("left","10px");let t=$(" .profile-btn",$(this).parent()).text();$(" p",e).fadeOut(200,function(){$(this).html(t).fadeIn(500)}),$("#chat-container .chats-container").html(`<ul id="chats">
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
                </form>`)})},e=function(){$(window).resize(function(){$(window).width()<=450?($("#logo-container a").html('<i class="fas fa-praying-hands"></i>'),console.log("hi")):($("#logo-container a").html('<img src="./finalgif.gif" alt="">'),console.log("hello"))})};e(),t()}
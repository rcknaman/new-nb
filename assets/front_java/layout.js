{

    let flag=1;
    let responsive=function(){

        $(window).resize(function(){
            if($(window).width()<690 && $('#mini-options ul li').length==1){
                $('#mini-options ul').append(`
                
                    <li><a class="dropdown-item" href="/users/friendAndGroups">friends,groups & Chats</a></li>
                
                `);
                flag=0;
            }
            else if($(window).width()>=690 && $('#mini-options ul li').length>1){
                $('#mini-options ul li').last().remove();
            }
            if($(window).width()<=450){
                $('#logo-container a').html(`<i class="fas fa-praying-hands"></i>`);
            }else{
                $('#logo-container a').html(`<img src="/images/finalgif.gif" alt="">`);
            }
        });
        if($(window).width()<690 && flag){
            $('#mini-options ul').append(`
            
                <li><a class="dropdown-item" href="/users/friendAndGroups">friends,groups & Chats</a></li>
            
            `);
            flag=0;
        }
        if($(window).width()<=450){
            $('#logo-container a').html(`<i class="fas fa-praying-hands"></i>`);
        }
    }
    console.log(`$('#chat-container .heading .fa-angle-down'): `,$('#chat-container .heading'));
    console.log(($('#chat-container>div').first().html()));

    responsive();
}
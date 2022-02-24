{


    let responsive=function(){


        $(window).resize(function(){
            if($(window).width()<=450){
                $('#logo-container a').html(`<i class="fas fa-praying-hands"></i>`);
            }else{
                $('#logo-container a').html(`<img src="/images/finalgif.gif" alt="">`);
            }
        })
    }
    console.log(`$('#chat-container .heading .fa-angle-down'): `,$('#chat-container .heading'));
    console.log(($('#chat-container>div').first().html()));

    responsive();
}
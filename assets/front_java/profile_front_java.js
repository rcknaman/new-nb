
{

    let add_friend=function(){
        let friend_btn=$('#friend-btn');

        $(friend_btn).click(function(e){
            

            e.preventDefault();
            $.ajax({

                type:'post',
                url:'/users/friends/toggle/'+$(friend_btn).prop('value'),
                success:function(data){

                    let deleted=data.data.deleted;
                    if(deleted){
                        $(friend_btn).html('Add Friend');
                    }else{
                        $(friend_btn).html('Remove');
                    }

                }


            });


        });


    }
    add_friend();



}
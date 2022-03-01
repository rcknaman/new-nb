{

    let flag=1;
    let responsive=function(){
        $(document).ready(function(){
            $(document).on('click','#CreategroupModal .btn-close',function(e){
                $('#CreategroupModal .group-name input').val('');
                $('#CreategroupModal .group-desc input').val('');
                $('#CreategroupModal .group-profile-pic img').attr('src','');
                $('#CreategroupModal .list-group').html('');
                $('#groupModalArea').html('Create Group');
            });
        });
        



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



    let filePreview=function(input){
    
        $(input).change(function(e){
    
            
            let img=$('+img',$(input));
            if($(input)[0].files && $(input)[0].files[0]){  
              let reader=new FileReader();
              reader.onload=function(e){
        
                $(img).prop('src',e.target.result);
                $('#pic-remove').css('display','block');
              }
              reader.readAsDataURL($(input)[0].files[0]);
              
            }
    
        });
        
    
      }
    
      let button_display=function(profile_pic){
        if($(profile_pic).prop('src')==""){
            $('#pic-remove').css('display','none');
          }else{
            $('#pic-remove').css('display','block');
          }
        
      }
    
      let img_remove=function(input){
        $('#pic-remove').click(function(e){
            let img=$('+img',$(input));
            $(img).prop('src','');
            $(input).val('');
            $('#pic-remove').css('display','none');
            
          });
      }
    
    
      let profile_pic=$('.group-profile-pic>input');
      button_display(profile_pic);
      filePreview(profile_pic);
      img_remove(profile_pic);
      responsive();

}
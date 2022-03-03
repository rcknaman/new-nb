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


  let profile_pic=$('#profile-pic>input');
  button_display(profile_pic);
  filePreview(profile_pic);
  img_remove(profile_pic);
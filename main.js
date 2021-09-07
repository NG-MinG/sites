document.getElementsByClassName('st_roadmap')[0].addEventListener('click', function(){
    document.getElementsByClassName('roadmap')[0].classList.remove('hiddens');    
});
document.getElementsByClassName('notepad-closebtn')[0].addEventListener('click', function(){
    document.getElementsByClassName('roadmap')[0].classList.add('hiddens');    
});
document.getElementsByClassName('st_practices')[0].addEventListener('click', function(){
    document.getElementsByClassName('practices')[0].classList.remove('hiddens');    
});
document.getElementsByClassName('notepad-closebtn')[1].addEventListener('click', function(){
    document.getElementsByClassName('practices')[0].classList.add('hiddens');    
});
document.getElementsByClassName('st_study')[0].addEventListener('click', function(){
    document.getElementsByClassName('study')[0].classList.remove('hiddens');    
});
document.getElementsByClassName('notepad-closebtn')[2].addEventListener('click', function(){
    document.getElementsByClassName('study')[0].classList.add('hiddens');    
});
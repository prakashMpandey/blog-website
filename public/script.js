
   function postlink(){
    document.querySelectorAll('.blog-post').forEach(div => {
        div.addEventListener('click', function() {
            const postId = this.getAttribute('data-id');
            window.location.href = `/api/v1/post/getPost/${postId}`;
        });
    });

   }
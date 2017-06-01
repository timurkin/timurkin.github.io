$(() => {
        let slickOptions = {
            prevArrow: '<span class="nav-arrow prev-arrow"></span>',
            nextArrow: '<span class="nav-arrow next-arrow"></span>',
            draggable: false,
        };
        $('.slides').slick(slickOptions);

        $('a[data-disable]').click(function(){
            let self = $(this);
            let filter = self.data('disable');

            $('ul.filter > li').removeClass('active');
            self.parent().addClass('active');
            $('.tile.disabled').removeClass('disabled');
            if(!filter) {
                $('.tile').removeClass('disabled');
            } else {
                $(`.tile[data-${filter}]`).addClass('disabled');
            }
            
            
        });

        let openModal = (html) => {
            $('.modal-content').html(html);
            $('.modal-wrapper').addClass('show');
        };

        let closeModal = () => $('.modal-content').html('') && $('.modal-wrapper').removeClass('show');
        $('.video .expand').click(function() { 
            let self =  $(this);
            openModal(`<iframe class="modal-video"  src="https://www.youtube.com/embed/${self.data('video-id')}" frameborder="0" allowfullscreen></iframe>`)
        });
        $('.photo .expand').click(function() {
            let self = $(this);
            openModal(`<img src="${self.data('image-url')}"/>`)
        });
        $('.modal-wrapper .close, .modal-wrapper .close-wrapper').click(closeModal);
    });
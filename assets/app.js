const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const  PLAYER_STORAGE_KEY = 'MUSIC_PLAYER'

const playList = $('.playlist')
const cd = $('.cd')
const player = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio_scr = $('#audio-src')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')


const app ={
    currentIndex: 0,
    isPlaying: false,
    isRandoming:false,
    isRepeat:false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
    {
      name: "Trọn vẹn nghĩa tình",
      singer: "Ưng Hoàng Phúc, Wowy",
      path: "./music/Tron Ven Nghia Tinh Phuc Cop OST_ - Ung.mp3",
      image: "https://i.ytimg.com/vi/sn96I37GVc0/sddefault.jpg"
    },
    {
      name: "Yêu và cứ yêu",
      singer: "Nguyên Ngọc Anh",
      path: "./music/Yeu-Va-Cu-Yeu-Nguyen-Ngoc-Anh.mp3",
      image:"https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/8/8/b/7/88b79ebb2b63a9f78741ff5b4925a92b.jpg"
    },
    {
      name: "Tháng năm bên nhau",
      singer: "Hồ Quỳnh Hương",
      path:"./music/Thang Nam Ben Nhau - Ho Quynh Huong.mp3",
      image: "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/covers/7/9/797556b03f790db366ff4a65cd0e6589_1512701905.jpg"

    },
    {
      name: "Chiếc khăn gió ấm",
      singer:"Tiên Cookie",
      path: "./music/Chiec-Khan-Gio-Am-Tien-Cookie.mp3",
      image:"https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/covers/6/2/62df066e6f9196dbeedadd35931b88ae_1382408334.jpg"

    },
    {
      name: "Tình đầu",
      singer: "Tăng Phúc",
      path: "./music/Tinh-Dau-Tang-Phuc.mp3",
      image:"https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/f/2/3/2/f232f18fb99341522b33cb15b3179394.jpg"
    },
    {
      name: "Có không giữ mất đừng tìm",
      singer: "Trúc Nhân",
      path: "./music/CoKhongGiuMatDungTim-TrucNhan-7215987.mp3",
      image:"https://vtv1.mediacdn.vn/thumb_w/650/2022/5/13/28064595050076275326236031124536647532604161n-16524127952251051157607-crop-16524128072171690937624.jpg"
    },
    {
      name: "Sau lưng anh có ai kia",
      singer: "Thiều Bảo Trâm",
      path: "./music/Sau Lung Anh Co Ai Kia - Thieu Bao Tram.mp3",
      image:"https://media-cdn-v2.laodong.vn/storage/newsportal/2022/4/12/1033433/SLACAK---24H.jpeg?w=960&crop=auto&scale=both"
    }
],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render:function (){
        const htmls = this.songs.map((song, index) =>{
            return ` 
                <div class="song ${index === this.currentIndex ? 'active': ''}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                    </div>
                </div>
            `
        });
        playList.innerHTML = htmls.join('')
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    loadCurrentSong: function (){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },

    scrollToSong: function() {
        setTimeout (()=>{
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            }, 200);
        })
           
    },

    handleEven: function() {

        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 15000,
            interation: Infinity
        })
        cdThumbAnimate.pause();


        // handle Scroll
        const cdWidth = cd.offsetWidth;
        document.onscroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newcdWidth = cdWidth - scrollTop ;
            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0;
            cd.style.opacity = newcdWidth / cdWidth ;
        }


        // handle button properties
        randomBtn.onclick = () =>{
            app.isRandoming = !app.isRandoming;
            app.setConfig('isRandoming', app.isRandoming);
            randomBtn.classList.toggle('active', app.isRandoming)
        }
        repeatBtn.onclick = () =>{
            app.isRepeat = !app.isRepeat;
            app.setConfig('isRepeat', app.isRepeat);
            repeatBtn.classList.toggle('active', app.isRepeat)
        }
        // handle Prev Music
        prevBtn.onclick = () =>{
            if(app.isRandoming){
                app.playRandomSong();
            }
            app.prevSong();
            audio.play();
            app.render();
        }
        //handle Next Music 
        nextBtn.onclick = () =>{
            if(app.isRandoming){
                app.playRandomSong();
            }
            app.nextSong();
            audio.play();
            app.render();
            app.scrollToSong();
        }

        // handle Play Music
        playBtn.onclick = () => {
            if (app.isPlaying){  
                audio.pause();
                cdThumbAnimate.pause();
            } else {
                audio.play();
                cdThumbAnimate.play();
            }
        }
        playList.onclick = function(even){
            const songNode = even.target.closest('.song:not(.active)')
            if (songNode || even.target.closest('.option')){
                
                if(songNode){
                    app.currentIndex = Number(songNode.dataset.index);
                    app.loadCurrentSong();
                    audio.play();
                    app.render();
                }
            }
        }
            // audio handle
            audio.onplay = () =>{
                app.isPlaying =true;
                player.classList.add('playing');
                cdThumbAnimate.play();
            }
            audio.onpause = () =>{
                app.isPlaying = false;
                player.classList.remove('playing');
            }

            audio.ontimeupdate = ()=>{
                if(audio.duration){
                    const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
                    progress.value = progressPercent;
                }
            }
            audio.onended =() =>{
                if(app.isRandoming){
                    setTimeout(2000);
                    nextBtn.click();
                } else if (app.isRepeat){
                    audio.play();
                }
            }

            progress.onchange = (even)=>{
                const seekTime = Math.floor(audio.duration / 100 * even.target.value);
                audio.currentTime = seekTime;
            }
    },
    loadConfig: function() {
        this.isRandoming = this.config.isRandoming;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function() {
        app.currentIndex++;
        if(this.currentIndex >= this.songs.length ){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        if(this.currentIndex <= 0 ){
            this.currentIndex = this.songs.length;
        }
        this.currentIndex--;
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let randomIdex = 2;
        do {
            randomIdex = Math.floor(Math.random() * app.songs.length);
        } while (this.currentIndex == randomIdex);
        this.currentIndex = randomIdex;
    },
    playRepeatSong: function() {

    },
    start: function() {
        this.loadConfig();

        this.defineProperties();
        this.handleEven();

        this.loadCurrentSong();

        this.render();

        randomBtn.classList.toggle('active', app.isRandoming)
        repeatBtn.classList.toggle('active', app.isRepeat) 
    }
}
app.start();
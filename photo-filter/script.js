/* FullScrin -------------------------------------*/
let FullScrin = document.getElementById("i");

FullScrin.onclick = ()=>{
  if(document.fullscreenElement)
  {
     document.exitFullscreen();
  }
  else
  {
     document.documentElement.requestFullscreen();
  }
}
/*----------------------------------------------------*/

/*-------------- Работа с ползунками --------------------------------*/
const inputs = document.querySelectorAll('.filters input');
function handleUpdate() {
    const suffix = this.dataset.sizing || '';
    document.documentElement.style.setProperty(`--${this.name}`, this.value + suffix);
  }
  function outputUpdate() {
    this.nextSibling.nextSibling.innerHTML = this.value;
}

  inputs.forEach(input => input.addEventListener('change', handleUpdate));
  inputs.forEach(input => input.addEventListener('mousemove', handleUpdate));
  inputs.forEach(input => input.addEventListener('mousemove', outputUpdate));
/*----------------------------------------------------*/

/* Reset кнопка --------------------------------------*/
let resetButton = document.querySelector(".editor .btn-container .btn-reset");

function restUpdate() {
  document.documentElement.style.setProperty('--blur' , '0px');
  document.documentElement.style.setProperty('--invert' , '0px');
  document.documentElement.style.setProperty('--sepia' , '0px');
  document.documentElement.style.setProperty('--saturate' , '100px');
  document.documentElement.style.setProperty('--hue' , '0deg');
  document.documentElement.style = "";

  inputs.forEach(input => input.value = "0");
  inputs[3].value ="100";
  inputs.forEach(input => input.nextSibling.nextSibling.innerHTML="0");
  inputs[3].nextSibling.nextSibling.innerHTML="100";
}

resetButton.addEventListener('click', restUpdate)
/*---------------------------------------------------------*/

/* Кнопка Load --------------------------------------------*/
let Loading = document.querySelector(".editor .btn-container .btn-load--input");
let loadimage = document.querySelector(".editor .loadimage");

function loadUpdate(){
  const File = this.files[0];
  const Reader = new FileReader();
  Reader.readAsDataURL(File);
  Reader.onload = () => {loadimage.src = Reader.result;}
}

Loading.addEventListener('input', loadUpdate);
/* -----------------------------------------------------*/

/* Кнопка Save -----------------------------------------*/
let Save = document.querySelector('.editor .btn-container .btn-save')
const canvas = document.querySelector('canvas');
function saveUpdate(){
  let prom = new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous'); 
    img.src = loadimage.src;

    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      ctx.filter = `blur(${inputs[0].value}px)
         invert(${inputs[1].value}%)
         sepia(${inputs[2].value}%)
         saturate(${inputs[3].value}%) 
         hue-rotate(${inputs[4].value}deg)`;

      console.log(ctx.filters);
      ctx.drawImage(img, 0, 0);
      resolve("result");
    } 
  })

    prom.then(
      result => {
        let link = document.createElement('a');
        link.download = 'loadimage.png';
        link.href = canvas.toDataURL();
        link.click();
        link.delete;
      }
    )
}

Save.addEventListener('click', saveUpdate);
/*--------------------------------------------------------*/

/*-----------------Next picture---------------------------*/
let Next = document.querySelector('.editor .btn-container .btn-next')


function viewBgImage(src) {
  const img = new Image();
  img.src = src;

  img.onload = () => {
    loadimage.src=`${src}`;
  };
}
let numberImage=0;
const images=[
  '01.jpg','02.jpg','03.jpg','04.jpg',
  '05.jpg','06.jpg','07.jpg','08.jpg','09.jpg','10.jpg',
  '11.jpg','12.jpg','13.jpg','14.jpg','15.jpg','16.jpg',
  '17.jpg','18.jpg','19.jpg','20.jpg'
];

let PeriodDay = ['night/', 'morning/', 'day/', 'evening/'];
let i = 0;

function getImage() {
  const GHlinks= 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/';
  let date = new Date();
  const number = i % images.length;
  const imgSourese = GHlinks + PeriodDay[Math.floor(date.getHours() / 6)] + images[number];
  viewBgImage(imgSourese);
  i++;
  Next.disabled=true;
  setTimeout(function() { Next.disabled = false },300);
}


Next.addEventListener('click', getImage);
/*------------------------------------------------------------*/
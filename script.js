const display = document.getElementById('clock');
const audio = new Audio('sounds/TheCrimsonX - Crimson Metal Gaming.mp3');
audio.loop = true;
let alarmTime = null;
let alarmTimeout = null;
let countdownInterval = null;

const alarmControls = document.getElementById('alarmControls');
const toggleAlarmSetupBtn = document.getElementById('toggleAlarmSetupBtn');
const cancelAlarmSetupBtn = document.getElementById('cancelAlarmSetupBtn');
const alarmInput = document.querySelector('#alarmControls input[type="datetime-local"]');
const countdownDisplay = document.getElementById('countdownDisplay');
const mainClearAlarmBtn = document.getElementById('mainClearAlarmBtn');
const themeSelector = document.getElementById('themeSelector');
const prevThemeBtn = document.getElementById('prevThemeBtn');
const nextThemeBtn = document.getElementById('nextThemeBtn');

const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

const themeColors = {
    // กลุ่มธีมสีโทนเดียว / ใกล้เคียงกัน (25 ธีม)
    "Crimson Red": {
        '--theme-color-1': '#CC0000', '--theme-color-2': '#AA3939', '--theme-color-3': '#800000',
        '--theme-highlight-color': '#FF3333', '--theme-hover-color': '#FF6666',
        '--theme-glow-color': 'rgba(204, 0, 0, 0.4)', '--theme-message-box-shadow': 'rgba(170, 57, 57, 0.5)',
        '--theme-powered-by-color': '#CC3333', '--theme-crimson-x-gradient': 'linear-gradient(to right, #CC0000, #FF6666, #FFCC66, #FF6666, #CC0000)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A1A1A', '--theme-input-border': '#444444', '--theme-text-color-light': '#F0F0F0'
    },
    "Scarlet Flame": {
        '--theme-color-1': '#FF2400', '--theme-color-2': '#DD3311', '--theme-color-3': '#AA1100',
        '--theme-highlight-color': '#FF6644', '--theme-hover-color': '#FF9977',
        '--theme-glow-color': 'rgba(255, 36, 0, 0.4)', '--theme-message-box-shadow': 'rgba(221, 51, 17, 0.5)',
        '--theme-powered-by-color': '#FF4422', '--theme-crimson-x-gradient': 'linear-gradient(to right, #FF2400, #FF6644, #FF9977, #FF6644, #FF2400)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A1A1A', '--theme-input-border': '#444444', '--theme-text-color-light': '#FFE0E0'
    },
    "Rose Blush": {
        '--theme-color-1': '#FF007F', '--theme-color-2': '#CC0066', '--theme-color-3': '#800040',
        '--theme-highlight-color': '#FF3399', '--theme-hover-color': '#FF66BB',
        '--theme-glow-color': 'rgba(255, 0, 127, 0.4)', '--theme-message-box-shadow': 'rgba(204, 0, 102, 0.5)',
        '--theme-powered-by-color': '#FF1A8C', '--theme-crimson-x-gradient': 'linear-gradient(to right, #FF007F, #FF3399, #FF66BB, #FF3399, #FF007F)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A1A1A', '--theme-input-border': '#444444', '--theme-text-color-light': '#FFF0F5'
    },
    "Soft Pink": {
        '--theme-color-1': '#FF69B4', '--theme-color-2': '#FF8DC7', '--theme-color-3': '#FF4FA0',
        '--theme-highlight-color': '#FFB6C1', '--theme-hover-color': '#FFDDEE',
        '--theme-glow-color': 'rgba(255, 105, 180, 0.4)', '--theme-message-box-shadow': 'rgba(255, 141, 199, 0.5)',
        '--theme-powered-by-color': '#FF99CC', '--theme-crimson-x-gradient': 'linear-gradient(to right, #FF69B4, #FFB6C1, #FFDDEE, #FFB6C1, #FF69B4)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#2A1A1A', '--theme-input-border': '#4C3333', '--theme-text-color-light': '#FFE0E8'
    },
    "Deep Blue": {
        '--theme-color-1': '#0000CC', '--theme-color-2': '#3939AA', '--theme-color-3': '#000080',
        '--theme-highlight-color': '#3333FF', '--theme-hover-color': '#6666FF',
        '--theme-glow-color': 'rgba(0, 0, 204, 0.4)', '--theme-message-box-shadow': 'rgba(57, 57, 170, 0.5)',
        '--theme-powered-by-color': '#3333CC', '--theme-crimson-x-gradient': 'linear-gradient(to right, #0000CC, #6666FF, #66CCFF, #6666FF, #0000CC)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A1A33', '--theme-input-border': '#444455', '--theme-text-color-light': '#DDEEFF'
    },
    "Sapphire Night": {
        '--theme-color-1': '#000040', '--theme-color-2': '#000066', '--theme-color-3': '#000020',
        '--theme-highlight-color': '#0000FF', '--theme-hover-color': '#3333FF',
        '--theme-glow-color': 'rgba(0, 0, 102, 0.5)', '--theme-message-box-shadow': 'rgba(0, 0, 64, 0.6)',
        '--theme-powered-by-color': '#000088', '--theme-crimson-x-gradient': 'linear-gradient(to right, #000040, #0000FF, #3333FF, #0000FF, #000040)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#0D0D1A', '--theme-input-border': '#22223A', '--theme-text-color-light': '#CCDDEE'
    },
    "Ocean Blue": {
        '--theme-color-1': '#0066CC', '--theme-color-2': '#3399FF', '--theme-color-3': '#004488',
        '--theme-highlight-color': '#66BBDD', '--theme-hover-color': '#99DDFF',
        '--theme-glow-color': 'rgba(0, 102, 204, 0.4)', '--theme-message-box-shadow': 'rgba(51, 153, 255, 0.5)',
        '--theme-powered-by-color': '#0077EE', '--theme-crimson-x-gradient': 'linear-gradient(to right, #0066CC, #66BBDD, #99DDFF, #66BBDD, #0066CC)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A2B3D', '--theme-input-border': '#334F66', '--theme-text-color-light': '#E0F0FF'
    },
    "Arctic Chill": {
        '--theme-color-1': '#3399CC', '--theme-color-2': '#66BBDD', '--theme-color-3': '#2277AA',
        '--theme-highlight-color': '#88EEFF', '--theme-hover-color': '#CCFFFF',
        '--theme-glow-color': 'rgba(51, 153, 204, 0.4)', '--theme-message-box-shadow': 'rgba(102, 187, 221, 0.5)',
        '--theme-powered-by-color': '#44AADD', '--theme-crimson-x-gradient': 'linear-gradient(to right, #3399CC, #88EEFF, #CCFFFF, #88EEFF, #3399CC)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A2B3D', '--theme-input-border': '#334F66', '--theme-text-color-light': '#E0F8FF'
    },
    "Sky Blue": {
        '--theme-color-1': '#87CEEB', '--theme-color-2': '#A0D6F1', '--theme-color-3': '#6DA4CE',
        '--theme-highlight-color': '#B3E0F7', '--theme-hover-color': '#CCEEFF',
        '--theme-glow-color': 'rgba(135, 206, 235, 0.4)', '--theme-message-box-shadow': 'rgba(160, 214, 241, 0.5)',
        '--theme-powered-by-color': '#98D0ED', '--theme-crimson-x-gradient': 'linear-gradient(to right, #87CEEB, #B3E0F7, #CCEEFF, #B3E0F7, #87CEEB)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A2B3D', '--theme-input-border': '#334F66', '--theme-text-color-light': '#E8F8FF'
    },
    "Emerald Green": {
        '--theme-color-1': '#00CC00', '--theme-color-2': '#39AA39', '--theme-color-3': '#008000',
        '--theme-highlight-color': '#33FF33', '--theme-hover-color': '#66FF66',
        '--theme-glow-color': 'rgba(0, 204, 0, 0.4)', '--theme-message-box-shadow': 'rgba(57, 170, 57, 0.5)',
        '--theme-powered-by-color': '#33CC33', '--theme-crimson-x-gradient': 'linear-gradient(to right, #00CC00, #66FF66, #66FFCC, #66FF66, #00CC00)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A331A', '--theme-input-border': '#445544', '--theme-text-color-light': '#EEFFEE'
    },
    "Jade Dynasty": {
        '--theme-color-1': '#006633', '--theme-color-2': '#00994C', '--theme-color-3': '#004C22',
        '--theme-highlight-color': '#00CC77', '--theme-hover-color': '#00FF99',
        '--theme-glow-color': 'rgba(0, 153, 76, 0.4)', '--theme-message-box-shadow': 'rgba(0, 102, 51, 0.5)',
        '--theme-powered-by-color': '#00AA66', '--theme-crimson-x-gradient': 'linear-gradient(to right, #006633, #00CC77, #00FF99, #00CC77, #006633)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A2A1A', '--theme-input-border': '#334F33', '--theme-text-color-light': '#DDFEF0'
    },
    "Forest Green": {
        '--theme-color-1': '#228B22', '--theme-color-2': '#3CB371', '--theme-color-3': '#1A521A',
        '--theme-highlight-color': '#66CDAA', '--theme-hover-color': '#88EEBB',
        '--theme-glow-color': 'rgba(34, 139, 34, 0.4)', '--theme-message-box-shadow': 'rgba(60, 179, 113, 0.5)',
        '--theme-powered-by-color': '#3CB371', '--theme-crimson-x-gradient': 'linear-gradient(to right, #228B22, #66CDAA, #88EEBB, #66CDAA, #228B22)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A2A1A', '--theme-input-border': '#334F33', '--theme-text-color-light': '#E8FFD8'
    },
    "Lime Zest": {
        '--theme-color-1': '#32CD32', '--theme-color-2': '#7CFC00', '--theme-color-3': '#228B22',
        '--theme-highlight-color': '#ADFF2F', '--theme-hover-color': '#CCFF66',
        '--theme-glow-color': 'rgba(50, 205, 50, 0.4)', '--theme-message-box-shadow': 'rgba(124, 252, 0, 0.5)',
        '--theme-powered-by-color': '#5ACD32', '--theme-crimson-x-gradient': 'linear-gradient(to right, #32CD32, #ADFF2F, #CCFF66, #ADFF2F, #32CD32)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A2A1A', '--theme-input-border': '#334F33', '--theme-text-color-light': '#E0FFE0'
    },
    "Mystic Teal": {
        '--theme-color-1': '#006666', '--theme-color-2': '#008888', '--theme-color-3': '#004444',
        '--theme-highlight-color': '#00AAAA', '--theme-hover-color': '#00CCCC',
        '--theme-glow-color': 'rgba(0, 136, 136, 0.4)', '--theme-message-box-shadow': 'rgba(0, 102, 102, 0.5)',
        '--theme-powered-by-color': '#009999', '--theme-crimson-x-gradient': 'linear-gradient(to right, #006666, #00AAAA, #00CCCC, #00AAAA, #006666)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A3333', '--theme-input-border': '#335555', '--theme-text-color-light': '#EEFFFF'
    },
    "Aqua Marine": {
        '--theme-color-1': '#00BFBF', '--theme-color-2': '#009999', '--theme-color-3': '#007070',
        '--theme-highlight-color': '#33FFFF', '--theme-hover-color': '#66FFFF',
        '--theme-glow-color': 'rgba(0, 191, 191, 0.4)', '--theme-message-box-shadow': 'rgba(0, 153, 153, 0.5)',
        '--theme-powered-by-color': '#00B0B0', '--theme-crimson-x-gradient': 'linear-gradient(to right, #00BFBF, #33FFFF, #66FFFF, #33FFFF, #00BFBF)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A3333', '--theme-input-border': '#445555', '--theme-text-color-light': '#EEFFFF'
    },
    "Royal Purple": {
        '--theme-color-1': '#8A2BE2', '--theme-color-2': '#9370DB', '--theme-color-3': '#4B0082',
        '--theme-highlight-color': '#BB33FF', '--theme-hover-color': '#DD66FF',
        '--theme-glow-color': 'rgba(138, 43, 226, 0.4)', '--theme-message-box-shadow': 'rgba(147, 112, 219, 0.5)',
        '--theme-powered-by-color': '#800080', '--theme-crimson-x-gradient': 'linear-gradient(to right, #8A2BE2, #9370DB, #BA55D3, #9370DB, #8A2BE2)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#331A33', '--theme-input-border': '#553355', '--theme-text-color-light': '#FFEEFF'
    },
    "Amethyst Haze": {
        '--theme-color-1': '#5D3FD3', '--theme-color-2': '#8C52FF', '--theme-color-3': '#3A2882',
        '--theme-highlight-color': '#A672FF', '--theme-hover-color': '#C0A0FF',
        '--theme-glow-color': 'rgba(140, 82, 255, 0.4)', '--theme-message-box-shadow': 'rgba(93, 63, 211, 0.5)',
        '--theme-powered-by-color': '#7540E0', '--theme-crimson-x-gradient': 'linear-gradient(to right, #5D3FD3, #A672FF, #C0A0FF, #A672FF, #5D3FD3)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#2A1A3A', '--theme-input-border': '#4C3366', '--theme-text-color-light': '#F0E0FF'
    },
    "Midnight Orchid": {
        '--theme-color-1': '#330055', '--theme-color-2': '#4B0082', '--theme-color-3': '#220033',
        '--theme-highlight-color': '#8B00FF', '--theme-hover-color': '#A600FF',
        '--theme-glow-color': 'rgba(75, 0, 130, 0.5)', '--theme-message-box-shadow': 'rgba(51, 0, 85, 0.6)',
        '--theme-powered-by-color': '#5A0DA0', '--theme-crimson-x-gradient': 'linear-gradient(to right, #330055, #8B00FF, #A600FF, #8B00FF, #330055)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A0D2A', '--theme-input-border': '#332244', '--theme-text-color-light': '#DDD0EE'
    },
    "Lavender Dream": {
        '--theme-color-1': '#B06EE0', '--theme-color-2': '#C79AEB', '--theme-color-3': '#8B4BC0',
        '--theme-highlight-color': '#DDAAFF', '--theme-hover-color': '#EECCFF',
        '--theme-glow-color': 'rgba(176, 110, 224, 0.4)', '--theme-message-box-shadow': 'rgba(199, 154, 235, 0.5)',
        '--theme-powered-by-color': '#C080E5', '--theme-crimson-x-gradient': 'linear-gradient(to right, #B06EE0, #DDAAFF, #EECCFF, #DDAAFF, #B06EE0)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#2A1A3D', '--theme-input-border': '#4C3366', '--theme-text-color-light': '#F8E8FF'
    },
    "Golden Hour": {
        '--theme-color-1': '#CCAA00', '--theme-color-2': '#AA8800', '--theme-color-3': '#806600',
        '--theme-highlight-color': '#FFDD33', '--theme-hover-color': '#FFFFCC',
        '--theme-glow-color': 'rgba(204, 170, 0, 0.4)', '--theme-message-box-shadow': 'rgba(170, 136, 0, 0.5)',
        '--theme-powered-by-color': '#CCBB00', '--theme-crimson-x-gradient': 'linear-gradient(to right, #CCAA00, #FFDD33, #FFFFCC, #FFDD33, #CCAA00)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#33331A', '--theme-input-border': '#555533', '--theme-text-color-light': '#FFFFEE'
    },
    "Solar Flare": {
        '--theme-color-1': '#FFD700', '--theme-color-2': '#FFA500', '--theme-color-3': '#FF4500',
        '--theme-highlight-color': '#FFE680', '--theme-hover-color': '#FFFFB3',
        '--theme-glow-color': 'rgba(255, 215, 0, 0.5)', '--theme-message-box-shadow': 'rgba(255, 165, 0, 0.5)',
        '--theme-powered-by-color': '#FFC000', '--theme-crimson-x-gradient': 'linear-gradient(to right, #FFD700, #FFA500, #FF4500, #FFA500, #FFD700)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#2A231A', '--theme-input-border': '#4D4133', '--theme-text-color-light': '#FFFFE0'
    },
    "Marigold Sun": {
        '--theme-color-1': '#FFCC00', '--theme-color-2': '#FFDD33', '--theme-color-3': '#FFAA00',
        '--theme-highlight-color': '#FFFF66', '--theme-hover-color': '#FFFF99',
        '--theme-glow-color': 'rgba(255, 204, 0, 0.4)', '--theme-message-box-shadow': 'rgba(255, 221, 51, 0.5)',
        '--theme-powered-by-color': '#FFD000', '--theme-crimson-x-gradient': 'linear-gradient(to right, #FFCC00, #FFFF66, #FFFF99, #FFFF66, #FFCC00)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#2A2A1A', '--theme-input-border': '#4D4D33', '--theme-text-color-light': '#FFFFD0'
    },
    "Bronze Age": {
        '--theme-color-1': '#CD7F32', '--theme-color-2': '#E09550', '--theme-color-3': '#A55D1A',
        '--theme-highlight-color': '#FFB060', '--theme-hover-color': '#FFCC99',
        '--theme-glow-color': 'rgba(205, 127, 50, 0.4)', '--theme-message-box-shadow': 'rgba(224, 149, 80, 0.5)',
        '--theme-powered-by-color': '#DA8A45', '--theme-crimson-x-gradient': 'linear-gradient(to right, #CD7F32, #FFB060, #FFCC99, #FFB060, #CD7F32)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#2A231A', '--theme-input-border': '#4D4133', '--theme-text-color-light': '#FFEEDD'
    },
    "Desert Sands": {
        '--theme-color-1': '#C2B280', '--theme-color-2': '#D2C290', '--theme-color-3': '#A29270',
        '--theme-highlight-color': '#E2D2A0', '--theme-hover-color': '#F2E2B0',
        '--theme-glow-color': 'rgba(194, 178, 128, 0.4)', '--theme-message-box-shadow': 'rgba(210, 194, 144, 0.5)',
        '--theme-powered-by-color': '#D0C090', '--theme-crimson-x-gradient': 'linear-gradient(to right, #C2B280, #D2C290, #E2D2A0, #D2C290, #C2B280)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#2B2B1E', '--theme-input-border': '#4A4A35', '--theme-text-color-light': '#F5F5E0'
    },
    "Chocolate Dream": {
        '--theme-color-1': '#654321', '--theme-color-2': '#8B4513', '--theme-color-3': '#4A2C10',
        '--theme-highlight-color': '#A0522D', '--theme-hover-color': '#D2691E',
        '--theme-glow-color': 'rgba(101, 67, 33, 0.4)', '--theme-message-box-shadow': 'rgba(139, 69, 19, 0.5)',
        '--theme-powered-by-color': '#7B3F00', '--theme-crimson-x-gradient': 'linear-gradient(to right, #654321, #A0522D, #D2691E, #A0522D, #654321)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#2A1D11', '--theme-input-border': '#4A3722', '--theme-text-color-light': '#DCDCDC'
    },
    "Stone Grey": {
        '--theme-color-1': '#808080', '--theme-color-2': '#AAAAAA', '--theme-color-3': '#606060',
        '--theme-highlight-color': '#CCCCCC', '--theme-hover-color': '#EEEEEE',
        '--theme-glow-color': 'rgba(128, 128, 128, 0.4)', '--theme-message-box-shadow': 'rgba(170, 170, 170, 0.5)',
        '--theme-powered-by-color': '#999999', '--theme-crimson-x-gradient': 'linear-gradient(to right, #808080, #CCCCCC, #EEEEEE, #CCCCCC, #808080)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#202020', '--theme-input-border': '#404040', '--theme-text-color-light': '#F0F0F0'
    },
    "Volcanic Ash": {
        '--theme-color-1': '#333333', '--theme-color-2': '#555555', '--theme-color-3': '#1A1A1A',
        '--theme-highlight-color': '#777777', '--theme-hover-color': '#AAAAAA',
        '--theme-glow-color': 'rgba(119, 119, 119, 0.3)', '--theme-message-box-shadow': 'rgba(85, 85, 85, 0.5)',
        '--theme-powered-by-color': '#666666', '--theme-crimson-x-gradient': 'linear-gradient(to right, #333333, #777777, #AAAAAA, #777777, #333333)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1C1C1C', '--theme-input-border': '#3D3D3D', '--theme-text-color-light': '#BBBBBB'
    },
    "Carbon Fiber": {
        '--theme-color-1': '#222222', '--theme-color-2': '#3A3A3A', '--theme-color-3': '#111111',
        '--theme-highlight-color': '#555555', '--theme-hover-color': '#777777',
        '--theme-glow-color': 'rgba(58, 58, 58, 0.3)', '--theme-message-box-shadow': 'rgba(34, 34, 34, 0.5)',
        '--theme-powered-by-color': '#444444', '--theme-crimson-x-gradient': 'linear-gradient(to right, #222222, #555555, #777777, #555555, #222222)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#151515', '--theme-input-border': '#2A2A2A', '--theme-text-color-light': '#CCCCCC'
    },
    "Obsidian Mirror": {
        '--theme-color-1': '#000000', '--theme-color-2': '#111111', '--theme-color-3': '#000000',
        '--theme-highlight-color': '#333333', '--theme-hover-color': '#555555',
        '--theme-glow-color': 'rgba(51, 51, 51, 0.2)', '--theme-message-box-shadow': 'rgba(17, 17, 17, 0.5)',
        '--theme-powered-by-color': '#222222', '--theme-crimson-x-gradient': 'linear-gradient(to right, #000000, #333333, #555555, #333333, #000000)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#050505', '--theme-input-border': '#1A1A1A', '--theme-text-color-light': '#BBBBBB'
    },
    "Silver Mist": {
        '--theme-color-1': '#C0C0C0', '--theme-color-2': '#D3D3D3', '--theme-color-3': '#A9A9A9',
        '--theme-highlight-color': '#E0E0E0', '--theme-hover-color': '#F0F0F0',
        '--theme-glow-color': 'rgba(192, 192, 192, 0.4)', '--theme-message-box-shadow': 'rgba(211, 211, 211, 0.5)',
        '--theme-powered-by-color': '#CCCCCC', '--theme-crimson-x-gradient': 'linear-gradient(to right, #C0C0C0, #E0E0E0, #F0F0F0, #E0E0E0, #C0C0C0)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#333333', '--theme-input-border': '#555555', '--theme-text-color-light': '#FFFFFF'
    },
    "Snow White": {
        '--theme-color-1': '#F0F0F0', '--theme-color-2': '#E0E0E0', '--theme-color-3': '#D0D0D0',
        '--theme-highlight-color': '#FFFFFF', '--theme-hover-color': '#FAFAFA',
        '--theme-glow-color': 'rgba(240, 240, 240, 0.4)', '--theme-message-box-shadow': 'rgba(224, 224, 224, 0.5)',
        '--theme-powered-by-color': '#E8E8E8', '--theme-crimson-x-gradient': 'linear-gradient(to right, #F0F0F0, #FFFFFF, #FAFAFA, #FFFFFF, #F0F0F0)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#4A4A4A', '--theme-input-border': '#6A6A6A', '--theme-text-color-light': '#AAAAAA'
    },
    "Pure Black": {
        '--theme-color-1': '#000000', '--theme-color-2': '#0A0A0A', '--theme-color-3': '#000000',
        '--theme-highlight-color': '#1A1A1A', '--theme-hover-color': '#2A2A2A',
        '--theme-glow-color': 'rgba(10, 10, 10, 0.2)', '--theme-message-box-shadow': 'rgba(0, 0, 0, 0.5)',
        '--theme-powered-by-color': '#050505', '--theme-crimson-x-gradient': 'linear-gradient(to right, #000000, #1A1A1A, #2A2A2A, #1A1A1A, #000000)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#000000', '--theme-input-border': '#111111', '--theme-text-color-light': '#A0A0A0'
    },
    "Spring Green": {
        '--theme-color-1': '#00FF7F', '--theme-color-2': '#33FF99', '--theme-color-3': '#00CC66',
        '--theme-highlight-color': '#66FFBB', '--theme-hover-color': '#99FFDD',
        '--theme-glow-color': 'rgba(0, 255, 127, 0.4)', '--theme-message-box-shadow': 'rgba(51, 255, 153, 0.5)',
        '--theme-powered-by-color': '#00E070', '--theme-crimson-x-gradient': 'linear-gradient(to right, #00FF7F, #66FFBB, #99FFDD, #66FFBB, #00FF7F)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A2A1A', '--theme-input-border': '#334D33', '--theme-text-color-light': '#E0FFF0'
    },
    "Olive Drab": {
        '--theme-color-1': '#6B8E23', '--theme-color-2': '#8B9C40', '--theme-color-3': '#55721F',
        '--theme-highlight-color': '#A6B660', '--theme-hover-color': '#C0C880',
        '--theme-glow-color': 'rgba(107, 142, 35, 0.4)', '--theme-message-box-shadow': 'rgba(139, 156, 64, 0.5)',
        '--theme-powered-by-color': '#7F9A2F', '--theme-crimson-x-gradient': 'linear-gradient(to right, #6B8E23, #A6B660, #C0C880, #A6B660, #6B8E23)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#2A2A1A', '--theme-input-border': '#4D4D33', '--theme-text-color-light': '#E0F0C0'
    },
    "Dark Chocolate": {
        '--theme-color-1': '#3C2012', '--theme-color-2': '#5A331E', '--theme-color-3': '#2B170B',
        '--theme-highlight-color': '#754B33', '--theme-hover-color': '#9C6F4B',
        '--theme-glow-color': 'rgba(60, 32, 18, 0.4)', '--theme-message-box-shadow': 'rgba(90, 51, 30, 0.5)',
        '--theme-powered-by-color': '#4D2F1B', '--theme-crimson-x-gradient': 'linear-gradient(to right, #3C2012, #754B33, #9C6F4B, #754B33, #3C2012)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A1109', '--theme-input-border': '#332211', '--theme-text-color-light': '#D0C0B0'
    },

    // กลุ่มธีมผสมสี / สดใส / แฟนตาซี / ฤดูกาล (25 ธีม)
    "Sunset Glow": {
        '--theme-color-1': '#FF5733', '--theme-color-2': '#FF8D33', '--theme-color-3': '#FFC300',
        '--theme-highlight-color': '#FFB08A', '--theme-hover-color': '#FFDDC2',
        '--theme-glow-color': 'rgba(255, 87, 51, 0.4)', '--theme-message-box-shadow': 'rgba(255, 141, 51, 0.5)',
        '--theme-powered-by-color': '#FF7A33', '--theme-crimson-x-gradient': 'linear-gradient(to right, #FF5733, #FF8D33, #FFC300, #FF8D33, #FF5733)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#33231A', '--theme-input-border': '#554133', '--theme-text-color-light': '#FFF0E0'
    },
    "Ocean Breeze": {
        '--theme-color-1': '#4682B4', '--theme-color-2': '#6A9EBF', '--theme-color-3': '#2E5984',
        '--theme-highlight-color': '#7EC0EE', '--theme-hover-color': '#9FC0DA',
        '--theme-glow-color': 'rgba(70, 130, 180, 0.4)', '--theme-message-box-shadow': 'rgba(106, 158, 191, 0.5)',
        '--theme-powered-by-color': '#5A90B8', '--theme-crimson-x-gradient': 'linear-gradient(to right, #4682B4, #6A9EBF, #9FC0DA, #6A9EBF, #4682B4)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A2F3D', '--theme-input-border': '#334F66', '--theme-text-color-light': '#E0F0FF'
    },
    "Violet Horizon": {
        '--theme-color-1': '#8A2BE2', '--theme-color-2': '#A020F0', '--theme-color-3': '#5D0099',
        '--theme-highlight-color': '#BB33FF', '--theme-hover-color': '#DD66FF',
        '--theme-glow-color': 'rgba(138, 43, 226, 0.5)', '--theme-message-box-shadow': 'rgba(160, 32, 240, 0.5)',
        '--theme-powered-by-color': '#9900CC', '--theme-crimson-x-gradient': 'linear-gradient(to right, #8A2BE2, #BB33FF, #DD66FF, #BB33FF, #8A2BE2)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#2A1A3A', '--theme-input-border': '#4C3366', '--theme-text-color-light': '#F0E0FF'
    },
    "Cosmic Dust": {
        '--theme-color-1': '#220044', '--theme-color-2': '#440088', '--theme-color-3': '#110022',
        '--theme-highlight-color': '#6600AA', '--theme-hover-color': '#8800CC',
        '--theme-glow-color': 'rgba(68, 0, 136, 0.3)', '--theme-message-box-shadow': 'rgba(34, 0, 68, 0.5)',
        '--theme-powered-by-color': '#550099', '--theme-crimson-x-gradient': 'linear-gradient(to right, #220044, #6600AA, #AA00FF, #6600AA, #220044)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#110022', '--theme-input-border': '#220044', '--theme-text-color-light': '#CCAAFF'
    },
    "Steampunk Bronze": {
        '--theme-color-1': '#6B4423', '--theme-color-2': '#9B6433', '--theme-color-3': '#4D301A',
        '--theme-highlight-color': '#C28B48', '--theme-hover-color': '#DDAA66',
        '--theme-glow-color': 'rgba(155, 100, 51, 0.4)', '--theme-message-box-shadow': 'rgba(194, 139, 72, 0.5)',
        '--theme-powered-by-color': '#AA7744', '--theme-crimson-x-gradient': 'linear-gradient(to right, #6B4423, #C28B48, #DDAA66, #C28B48, #6B4423)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#2C2016', '--theme-input-border': '#4A372A', '--theme-text-color-light': '#E0D0BB'
    },
    "Plasma Blast": {
        '--theme-color-1': '#00F0FF', '--theme-color-2': '#FF00FF', '--theme-color-3': '#8A2BE2',
        '--theme-highlight-color': '#66FFFF', '--theme-hover-color': '#CCFFFF',
        '--theme-glow-color': 'rgba(0, 240, 255, 0.6)', '--theme-message-box-shadow': 'rgba(255, 0, 255, 0.5)',
        '--theme-powered-by-color': '#FF33CC', '--theme-crimson-x-gradient': 'linear-gradient(to right, #00F0FF, #FF00FF, #8A2BE2, #FF00FF, #00F0FF)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A1A2A', '--theme-input-border': '#333355', '--theme-text-color-light': '#E0FFFF'
    },
    "Cyberpunk Neon": {
        '--theme-color-1': '#00FF00', '--theme-color-2': '#00FFFF', '--theme-color-3': '#FF00FF',
        '--theme-highlight-color': '#00FF00', '--theme-hover-color': '#00FF00',
        '--theme-glow-color': 'rgba(0, 255, 255, 0.6)', '--theme-message-box-shadow': 'rgba(0, 255, 255, 0.5)',
        '--theme-powered-by-color': '#00FFCC', '--theme-crimson-x-gradient': 'linear-gradient(to right, #00FF00, #00FFFF, #FF00FF, #00FFFF, #00FF00)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A1A1A', '--theme-input-border': '#00AAFF', '--theme-text-color-light': '#EEFFFF'
    },
    "Coral Reef": {
        '--theme-color-1': '#FF6F61', '--theme-color-2': '#FF8A7A', '--theme-color-3': '#FF4A38',
        '--theme-highlight-color': '#FF9F92', '--theme-hover-color': '#FFBBAA',
        '--theme-glow-color': 'rgba(255, 111, 97, 0.4)', '--theme-message-box-shadow': 'rgba(255, 138, 122, 0.5)',
        '--theme-powered-by-color': '#FF7F70', '--theme-crimson-x-gradient': 'linear-gradient(to right, #FF6F61, #FF8A7A, #FFBBAA, #FF8A7A, #FF6F61)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#2A1D1B', '--theme-input-border': '#4C3733', '--theme-text-color-light': '#FFE0DD'
    },
    "Galactic Storm": {
        '--theme-color-1': '#1A0033', '--theme-color-2': '#330066', '--theme-color-3': '#0D001A',
        '--theme-highlight-color': '#6600CC', '--theme-hover-color': '#9900FF',
        '--theme-glow-color': 'rgba(102, 0, 204, 0.5)', '--theme-message-box-shadow': 'rgba(51, 0, 102, 0.5)',
        '--theme-powered-by-color': '#440088', '--theme-crimson-x-gradient': 'linear-gradient(to right, #1A0033, #6600CC, #9900FF, #6600CC, #1A0033)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#0D001A', '--theme-input-border': '#26004D', '--theme-text-color-light': '#DDD0FF'
    },
    "Christmas Spirit": {
        '--theme-color-1': '#B30000', '--theme-color-2': '#006600', '--theme-color-3': '#FFCC00',
        '--theme-highlight-color': '#FF0000', '--theme-hover-color': '#FF3333',
        '--theme-glow-color': 'rgba(179, 0, 0, 0.4)', '--theme-message-box-shadow': 'rgba(0, 102, 0, 0.5)',
        '--theme-powered-by-color': '#FF6600', '--theme-crimson-x-gradient': 'linear-gradient(to right, #B30000, #FF0000, #FFCC00, #FF0000, #B30000)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#2A1A1A', '--theme-input-border': '#4A3333', '--theme-text-color-light': '#E0FFD0'
    },
    "Halloween Night": {
        '--theme-color-1': '#FF4500', '--theme-color-2': '#4B0082', '--theme-color-3': '#000000',
        '--theme-highlight-color': '#FF8C00', '--theme-hover-color': '#FFCC00',
        '--theme-glow-color': 'rgba(255, 69, 0, 0.4)', '--theme-message-box-shadow': 'rgba(75, 0, 130, 0.5)',
        '--theme-powered-by-color': '#FF6600', '--theme-crimson-x-gradient': 'linear-gradient(to right, #FF4500, #8A2BE2, #FF00FF, #8A2BE2, #FF4500)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A1A1A', '--theme-input-border': '#333333', '--theme-text-color-light': '#FFF0DD'
    },
    "Winter Solstice": {
        '--theme-color-1': '#336699', '--theme-color-2': '#5588BB', '--theme-color-3': '#224477',
        '--theme-highlight-color': '#77AADD', '--theme-hover-color': '#AACCFF',
        '--theme-glow-color': 'rgba(51, 102, 153, 0.4)', '--theme-message-box-shadow': 'rgba(85, 136, 187, 0.5)',
        '--theme-powered-by-color': '#4477AA', '--theme-crimson-x-gradient': 'linear-gradient(to right, #336699, #5588BB, #77AADD, #5588BB, #336699)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A2B3D', '--theme-input-border': '#334B66', '--theme-text-color-light': '#E0EEFF'
    },
    "Tropical Sunset": {
        '--theme-color-1': '#FF7F50', '--theme-color-2': '#FFD700', '--theme-color-3': '#40E0D0',
        '--theme-highlight-color': '#FFAB80', '--theme-hover-color': '#FFCDA0',
        '--theme-glow-color': 'rgba(255, 127, 80, 0.4)', '--theme-message-box-shadow': 'rgba(255, 215, 0, 0.5)',
        '--theme-powered-by-color': '#FF9966', '--theme-crimson-x-gradient': 'linear-gradient(to right, #FF7F50, #FFD700, #40E0D0, #FFD700, #FF7F50)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#2A1A1A', '--theme-input-border': '#4C3333', '--theme-text-color-light': '#FFEEDD'
    },
    "Mystic Forest": {
        '--theme-color-1': '#228B22', '--theme-color-2': '#006400', '--theme-color-3': '#4B0082',
        '--theme-highlight-color': '#3CB371', '--theme-hover-color': '#66CDAA',
        '--theme-glow-color': 'rgba(34, 139, 34, 0.4)', '--theme-message-box-shadow': 'rgba(0, 100, 0, 0.5)',
        '--theme-powered-by-color': '#3CB371', '--theme-crimson-x-gradient': 'linear-gradient(to right, #228B22, #3CB371, #66CDAA, #3CB371, #228B22)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A2A1A', '--theme-input-border': '#334D33', '--theme-text-color-light': '#D0FFD0'
    },
    "Lavender Twilight": {
        '--theme-color-1': '#B06EE0', '--theme-color-2': '#4B0082', '--theme-color-3': '#800080',
        '--theme-highlight-color': '#DDAAFF', '--theme-hover-color': '#EECCFF',
        '--theme-glow-color': 'rgba(176, 110, 224, 0.4)', '--theme-message-box-shadow': 'rgba(75, 0, 130, 0.5)',
        '--theme-powered-by-color': '#C080E5', '--theme-crimson-x-gradient': 'linear-gradient(to right, #B06EE0, #DDAAFF, #EECCFF, #DDAAFF, #B06EE0)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#2A1A3D', '--theme-input-border': '#4C3366', '--theme-text-color-light': '#F8E8FF'
    },
    "Desert Night": {
        '--theme-color-1': '#36454F', '--theme-color-2': '#708090', '--theme-color-3': '#000000',
        '--theme-highlight-color': '#808080', '--theme-hover-color': '#A0A0A0',
        '--theme-glow-color': 'rgba(54, 69, 79, 0.4)', '--theme-message-box-shadow': 'rgba(112, 128, 144, 0.5)',
        '--theme-powered-by-color': '#586A7B', '--theme-crimson-x-gradient': 'linear-gradient(to right, #36454F, #808080, #A0A0A0, #808080, #36454F)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A1A1A', '--theme-input-border': '#333333', '--theme-text-color-light': '#D0D0D0'
    },
    "Ocean Depths": {
        '--theme-color-1': '#000080', '--theme-color-2': '#0000CD', '--theme-color-3': '#000033',
        '--theme-highlight-color': '#1111EE', '--theme-hover-color': '#4444FF',
        '--theme-glow-color': 'rgba(0, 0, 128, 0.4)', '--theme-message-box-shadow': 'rgba(0, 0, 205, 0.5)',
        '--theme-powered-by-color': '#0000B0', '--theme-crimson-x-gradient': 'linear-gradient(to right, #000080, #1111EE, #4444FF, #1111EE, #000080)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#0D0D1A', '--theme-input-border': '#22223A', '--theme-text-color-light': '#BBBBFF'
    },
    "Enchanted Forest": {
        '--theme-color-1': '#0A4B0A', '--theme-color-2': '#228B22', '--theme-color-3': '#1A1A1A',
        '--theme-highlight-color': '#3CB371', '--theme-hover-color': '#66CDAA',
        '--theme-glow-color': 'rgba(10, 75, 10, 0.4)', '--theme-message-box-shadow': 'rgba(34, 139, 34, 0.5)',
        '--theme-powered-by-color': '#2A7A2A', '--theme-crimson-x-gradient': 'linear-gradient(to right, #0A4B0A, #3CB371, #66CDAA, #3CB371, #0A4B0A)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#111111', '--theme-input-border': '#222222', '--theme-text-color-light': '#D0FFD0'
    },
    "Fiery Sunset": {
        '--theme-color-1': '#FF4500', '--theme-color-2': '#FF8C00', '--theme-color-3': '#FFD700',
        '--theme-highlight-color': '#FF6347', '--theme-hover-color': '#FF9966',
        '--theme-glow-color': 'rgba(255, 69, 0, 0.5)', '--theme-message-box-shadow': 'rgba(255, 140, 0, 0.5)',
        '--theme-powered-by-color': '#FF7F50', '--theme-crimson-x-gradient': 'linear-gradient(to right, #FF4500, #FF6347, #FF9966, #FF6347, #FF4500)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#2A1A1A', '--theme-input-border': '#4C3333', '--theme-text-color-light': '#FFE0CC'
    },
    "Arctic Aurora": {
        '--theme-color-1': '#00FFFF', '--theme-color-2': '#00FF7F', '--theme-color-3': '#00BFFF',
        '--theme-highlight-color': '#33FFCC', '--theme-hover-color': '#66FFEE',
        '--theme-glow-color': 'rgba(0, 255, 255, 0.5)', '--theme-message-box-shadow': 'rgba(0, 255, 127, 0.5)',
        '--theme-powered-by-color': '#00E0E0', '--theme-crimson-x-gradient': 'linear-gradient(to right, #00FFFF, #33FFCC, #66FFEE, #33FFCC, #00FFFF)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A2A2A', '--theme-input-border': '#334D4D', '--theme-text-color-light': '#E0FFFF'
    },
    "Mystic Dawn": {
        '--theme-color-1': '#4B0082', '--theme-color-2': '#800080', '--theme-color-3': '#FF00FF',
        '--theme-highlight-color': '#9932CC', '--theme-hover-color': '#C71585',
        '--theme-glow-color': 'rgba(75, 0, 130, 0.4)', '--theme-message-box-shadow': 'rgba(128, 0, 128, 0.5)',
        '--theme-powered-by-color': '#A020F0', '--theme-crimson-x-gradient': 'linear-gradient(to right, #4B0082, #9932CC, #C71585, #9932CC, #4B0082)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A1A2A', '--theme-input-border': '#33334D', '--theme-text-color-light': '#F0E0F8'
    },
    "Tropical Punch": {
        '--theme-color-1': '#FF6347', '--theme-color-2': '#FFD700', '--theme-color-3': '#33CCFF',
        '--theme-highlight-color': '#FFA07A', '--theme-hover-color': '#FFECB3',
        '--theme-glow-color': 'rgba(255, 99, 71, 0.4)', '--theme-message-box-shadow': 'rgba(255, 215, 0, 0.5)',
        '--theme-powered-by-color': '#FF8060', '--theme-crimson-x-gradient': 'linear-gradient(to right, #FF6347, #FFA07A, #FFECB3, #FFA07A, #FF6347)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#2A1A1A', '--theme-input-border': '#4C3333', '--theme-text-color-light': '#FFEEDD'
    },
    "Emerald Glow": {
        '--theme-color-1': '#00FF00', '--theme-color-2': '#33FF33', '--theme-color-3': '#00CC00',
        '--theme-highlight-color': '#66FF66', '--theme-hover-color': '#99FF99',
        '--theme-glow-color': 'rgba(0, 255, 0, 0.4)', '--theme-message-box-shadow': 'rgba(51, 255, 51, 0.5)',
        '--theme-powered-by-color': '#00E000', '--theme-crimson-x-gradient': 'linear-gradient(to right, #00FF00, #66FF66, #99FF99, #66FF66, #00FF00)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A2A1A', '--theme-input-border': '#334D33', '--theme-text-color-light': '#E0FFE0'
    },
    "Sapphire Bloom": {
        '--theme-color-1': '#00BFFF', '--theme-color-2': '#1E90FF', '--theme-color-3': '#007FFF',
        '--theme-highlight-color': '#66CCFF', '--theme-hover-color': '#99DDFF',
        '--theme-glow-color': 'rgba(0, 191, 255, 0.4)', '--theme-message-box-shadow': 'rgba(30, 144, 255, 0.5)',
        '--theme-powered-by-color': '#00A0E0', '--theme-crimson-x-gradient': 'linear-gradient(to right, #00BFFF, #66CCFF, #99DDFF, #66CCFF, #00BFFF)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A2A3D', '--theme-input-border': '#334D66', '--theme-text-color-light': '#E0F0FF'
    },
    "Crimson Night": {
        '--theme-color-1': '#8B0000', '--theme-color-2': '#B22222', '--theme-color-3': '#550000',
        '--theme-highlight-color': '#CD5C5C', '--theme-hover-color': '#FF6666',
        '--theme-glow-color': 'rgba(139, 0, 0, 0.4)', '--theme-message-box-shadow': 'rgba(178, 34, 34, 0.5)',
        '--theme-powered-by-color': '#A52A2A', '--theme-crimson-x-gradient': 'linear-gradient(to right, #8B0000, #CD5C5C, #FF6666, #CD5C5C, #8B0000)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A1A1A', '--theme-input-border': '#333333', '--theme-text-color-light': '#FFE0E0'
    },
    "Golden Ember": {
        '--theme-color-1': '#FF8C00', '--theme-color-2': '#FFB300', '--theme-color-3': '#CC6600',
        '--theme-highlight-color': '#FFD700', '--theme-hover-color': '#FFFF33',
        '--theme-glow-color': 'rgba(255, 140, 0, 0.4)', '--theme-message-box-shadow': 'rgba(255, 179, 0, 0.5)',
        '--theme-powered-by-color': '#FF9900', '--theme-crimson-x-gradient': 'linear-gradient(to right, #FF8C00, #FFD700, #FFFF33, #FFD700, #FF8C00)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#2A1A1A', '--theme-input-border': '#4C3333', '--theme-text-color-light': '#FFEEDD'
    },
    "Azure Sky": {
        '--theme-color-1': '#007FFF', '--theme-color-2': '#4169E1', '--theme-color-3': '#003366',
        '--theme-highlight-color': '#6495ED', '--theme-hover-color': '#ADD8E6',
        '--theme-glow-color': 'rgba(0, 127, 255, 0.4)', '--theme-message-box-shadow': 'rgba(65, 105, 225, 0.5)',
        '--theme-powered-by-color': '#0066CC', '--theme-crimson-x-gradient': 'linear-gradient(to right, #007FFF, #6495ED, #ADD8E6, #6495ED, #007FFF)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A2A3D', '--theme-input-border': '#334D66', '--theme-text-color-light': '#E0F0FF'
    },
    "Violet Storm": {
        '--theme-color-1': '#4B0082', '--theme-color-2': '#800080', '--theme-color-3': '#9400D3',
        '--theme-highlight-color': '#BA55D3', '--theme-hover-color': '#DA70D6',
        '--theme-glow-color': 'rgba(75, 0, 130, 0.4)', '--theme-message-box-shadow': 'rgba(128, 0, 128, 0.5)',
        '--theme-powered-by-color': '#A020F0', '--theme-crimson-x-gradient': 'linear-gradient(to right, #4B0082, #BA55D3, #DA70D6, #BA55D3, #4B0082)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A1A2A', '--theme-input-border': '#33334D', '--theme-text-color-light': '#F0E0F8'
    },
    "Emerald Abyss": {
        '--theme-color-1': '#004C4C', '--theme-color-2': '#008080', '--theme-color-3': '#002626',
        '--theme-highlight-color': '#00AAAA', '--theme-hover-color': '#00CCCC',
        '--theme-glow-color': 'rgba(0, 76, 76, 0.4)', '--theme-message-box-shadow': 'rgba(0, 128, 128, 0.5)',
        '--theme-powered-by-color': '#006666', '--theme-crimson-x-gradient': 'linear-gradient(to right, #004C4C, #00AAAA, #00CCCC, #00AAAA, #004C4C)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#0D1A1A', '--theme-input-border': '#223333', '--theme-text-color-light': '#C0FFFF'
    },
    "Midnight Blue": {
        '--theme-color-1': '#191970', '--theme-color-2': '#4682B4', '--theme-color-3': '#000033',
        '--theme-highlight-color': '#6A5ACD', '--theme-hover-color': '#7B68EE',
        '--theme-glow-color': 'rgba(25, 25, 112, 0.4)', '--theme-message-box-shadow': 'rgba(70, 130, 180, 0.5)',
        '--theme-powered-by-color': '#36454F', '--theme-crimson-x-gradient': 'linear-gradient(to right, #191970, #6A5ACD, #7B68EE, #6A5ACD, #191970)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#0D0D1A', '--theme-input-border': '#22223A', '--theme-text-color-light': '#E0E0FF'
    },
    "Rose Gold": {
        '--theme-color-1': '#B76E79', '--theme-color-2': '#D7999B', '--theme-color-3': '#A05C63',
        '--theme-highlight-color': '#FFC0CB', '--theme-hover-color': '#FFE0E5',
        '--theme-glow-color': 'rgba(183, 110, 121, 0.4)', '--theme-message-box-shadow': 'rgba(215, 153, 155, 0.5)',
        '--theme-powered-by-color': '#CC8888', '--theme-crimson-x-gradient': 'linear-gradient(to right, #B76E79, #FFC0CB, #FFE0E5, #FFC0CB, #B76E79)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#2A1A1A', '--theme-input-border': '#4C3333', '--theme-text-color-light': '#FFEFEF'
    },
    "Solar Eclipse": {
        '--theme-color-1': '#363636', '--theme-color-2': '#FFD700', '--theme-color-3': '#4B0082',
        '--theme-highlight-color': '#696969', '--theme-hover-color': '#808080',
        '--theme-glow-color': 'rgba(255, 215, 0, 0.4)', '--theme-message-box-shadow': 'rgba(75, 0, 130, 0.5)',
        '--theme-powered-by-color': '#FFC000', '--theme-crimson-x-gradient': 'linear-gradient(to right, #363636, #FFD700, #4B0082, #FFD700, #363636)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A1A1A', '--theme-input-border': '#333333', '--theme-text-color-light': '#F0F0F0'
    },
    "Abyss Green": {
        '--theme-color-1': '#003300', '--theme-color-2': '#005500', '--theme-color-3': '#001A00',
        '--theme-highlight-color': '#007700', '--theme-hover-color': '#009900',
        '--theme-glow-color': 'rgba(0, 51, 0, 0.4)', '--theme-message-box-shadow': 'rgba(0, 85, 0, 0.5)',
        '--theme-powered-by-color': '#004400', '--theme-crimson-x-gradient': 'linear-gradient(to right, #003300, #007700, #009900, #007700, #003300)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#0D1A0D', '--theme-input-border': '#223322', '--theme-text-color-light': '#CCFFCC'
    },
    "Ruby Charm": {
        '--theme-color-1': '#E0115F', '--theme-color-2': '#FF338A', '--theme-color-3': '#A00045',
        '--theme-highlight-color': '#FF66B2', '--theme-hover-color': '#FF99CD',
        '--theme-glow-color': 'rgba(224, 17, 95, 0.4)', '--theme-message-box-shadow': 'rgba(255, 51, 138, 0.5)',
        '--theme-powered-by-color': '#FF3399', '--theme-crimson-x-gradient': 'linear-gradient(to right, #E0115F, #FF66B2, #FF99CD, #FF66B2, #E0115F)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A1A1A', '--theme-input-border': '#444444', '--theme-text-color-light': '#FFF0F5'
    },
    "Deep Emerald": {
        '--theme-color-1': '#004D40', '--theme-color-2': '#00695C', '--theme-color-3': '#00332B',
        '--theme-highlight-color': '#00897B', '--theme-hover-color': '#00AA99',
        '--theme-glow-color': 'rgba(0, 77, 64, 0.4)', '--theme-message-box-shadow': 'rgba(0, 105, 92, 0.5)',
        '--theme-powered-by-color': '#00796B', '--theme-crimson-x-gradient': 'linear-gradient(to right, #004D40, #00897B, #00AA99, #00897B, #004D40)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A1A1A', '--theme-input-border': '#333333', '--theme-text-color-light': '#E0FFF0'
    },
    "Sapphire Dust": {
        '--theme-color-1': '#1F1F47', '--theme-color-2': '#333366', '--theme-color-3': '#0A0A2A',
        '--theme-highlight-color': '#5555AA', '--theme-hover-color': '#7777CC',
        '--theme-glow-color': 'rgba(31, 31, 71, 0.4)', '--theme-message-box-shadow': 'rgba(51, 51, 102, 0.5)',
        '--theme-powered-by-color': '#2A2A5A', '--theme-crimson-x-gradient': 'linear-gradient(to right, #1F1F47, #5555AA, #7777CC, #5555AA, #1F1F47)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#11111A', '--theme-input-border': '#222233', '--theme-text-color-light': '#D0D0FF'
    },
    "Golden Leaf": {
        '--theme-color-1': '#B8860B', '--theme-color-2': '#DAA520', '--theme-color-3': '#8B4513',
        '--theme-highlight-color': '#FFD700', '--theme-hover-color': '#FFEF00',
        '--theme-glow-color': 'rgba(184, 134, 11, 0.4)', '--theme-message-box-shadow': 'rgba(218, 165, 32, 0.5)',
        '--theme-powered-by-color': '#CCAA00', '--theme-crimson-x-gradient': 'linear-gradient(to right, #B8860B, #FFD700, #FFEF00, #FFD700, #B8860B)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#2A1A1A', '--theme-input-border': '#4C3333', '--theme-text-color-light': '#FFEEDD'
    },
    "Mystic Amethyst": {
        '--theme-color-1': '#6A0572', '--theme-color-2': '#800080', '--theme-color-3': '#4B0082',
        '--theme-highlight-color': '#9932CC', '--theme-hover-color': '#C71585',
        '--theme-glow-color': 'rgba(106, 5, 114, 0.4)', '--theme-message-box-shadow': 'rgba(128, 0, 128, 0.5)',
        '--theme-powered-by-color': '#7A008A', '--theme-crimson-x-gradient': 'linear-gradient(to right, #6A0572, #9932CC, #C71585, #9932CC, #6A0572)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A1A2A', '--theme-input-border': '#33334D', '--theme-text-color-light': '#F0E0F8'
    },
    "Crimson Gold": {
        '--theme-color-1': '#B30000', '--theme-color-2': '#FFCC00', '--theme-color-3': '#CC0000',
        '--theme-highlight-color': '#FF3333', '--theme-hover-color': '#FFD700',
        '--theme-glow-color': 'rgba(179, 0, 0, 0.4)', '--theme-message-box-shadow': 'rgba(255, 204, 0, 0.5)',
        '--theme-powered-by-color': '#E06600', '--theme-crimson-x-gradient': 'linear-gradient(to right, #B30000, #FF3333, #FFD700, #FF3333, #B30000)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#2A1A1A', '--theme-input-border': '#4C3333', '--theme-text-color-light': '#FFEEDD'
    },
    "Ocean Sunset": {
        '--theme-color-1': '#007FFF', '--theme-color-2': '#FF4500', '--theme-color-3': '#FFD700',
        '--theme-highlight-color': '#33CCFF', '--theme-hover-color': '#66E0FF',
        '--theme-glow-color': 'rgba(0, 127, 255, 0.4)', '--theme-message-box-shadow': 'rgba(255, 69, 0, 0.5)',
        '--theme-powered-by-color': '#6699FF', '--theme-crimson-x-gradient': 'linear-gradient(to right, #007FFF, #33CCFF, #66E0FF, #33CCFF, #007FFF)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A2A1A', '--theme-input-border': '#334D4D', '--theme-text-color-light': '#FFEEDD'
    },
    "Forest Berries": {
        '--theme-color-1': '#228B22', '--theme-color-2': '#800080', '--theme-color-3': '#8B0000',
        '--theme-highlight-color': '#3CB371', '--theme-hover-color': '#66CDAA',
        '--theme-glow-color': 'rgba(34, 139, 34, 0.4)', '--theme-message-box-shadow': 'rgba(128, 0, 128, 0.5)',
        '--theme-powered-by-color': '#3CB371', '--theme-crimson-x-gradient': 'linear-gradient(to right, #228B22, #3CB371, #66CDAA, #3CB371, #228B22)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A1A1A', '--theme-input-border': '#333333', '--theme-text-color-light': '#D0FFD0'
    },
    "Magical Unicorn": {
        '--theme-color-1': '#FF69B4', '--theme-color-2': '#8A2BE2', '--theme-color-3': '#00FFFF',
        '--theme-highlight-color': '#FF99D0', '--theme-hover-color': '#FFCCE6',
        '--theme-glow-color': 'rgba(255, 105, 180, 0.4)', '--theme-message-box-shadow': 'rgba(138, 43, 226, 0.5)',
        '--theme-powered-by-color': '#FF99CC', '--theme-crimson-x-gradient': 'linear-gradient(to right, #FF69B4, #8A2BE2, #00FFFF, #8A2BE2, #FF69B4)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A1A1A', '--theme-input-border': '#333333', '--theme-text-color-light': '#F8E8FF'
    },
    "Vibrant Summer": {
        '--theme-color-1': '#FFD700', '--theme-color-2': '#FF6347', '--theme-color-3': '#33CCFF',
        '--theme-highlight-color': '#FFE680', '--theme-hover-color': '#FFFFB3',
        '--theme-glow-color': 'rgba(255, 215, 0, 0.4)', '--theme-message-box-shadow': 'rgba(255, 99, 71, 0.5)',
        '--theme-powered-by-color': '#FFC000', '--theme-crimson-x-gradient': 'linear-gradient(to right, #FFD700, #FFE680, #FFFFB3, #FFE680, #FFD700)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#2A1A1A', '--theme-input-border': '#4C3333', '--theme-text-color-light': '#FFEEDD'
    },
    "Grape Harvest": {
        '--theme-color-1': '#6A0572', '--theme-color-2': '#9370DB', '--theme-color-3': '#4B0082',
        '--theme-highlight-color': '#800080', '--theme-hover-color': '#A020F0',
        '--theme-glow-color': 'rgba(106, 5, 114, 0.4)', '--theme-message-box-shadow': 'rgba(147, 112, 219, 0.5)',
        '--theme-powered-by-color': '#7A008A', '--theme-crimson-x-gradient': 'linear-gradient(to right, #6A0572, #800080, #A020F0, #800080, #6A0572)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A1A2A', '--theme-input-border': '#33334D', '--theme-text-color-light': '#F0E0FF'
    },
    "Dark Chocolate Mint": {
        '--theme-color-1': '#3C2012', '--theme-color-2': '#008080', '--theme-color-3': '#1A1A1A',
        '--theme-highlight-color': '#5A331E', '--theme-hover-color': '#754B33',
        '--theme-glow-color': 'rgba(60, 32, 18, 0.4)', '--theme-message-box-shadow': 'rgba(0, 128, 128, 0.5)',
        '--theme-powered-by-color': '#4D2F1B', '--theme-crimson-x-gradient': 'linear-gradient(to right, #3C2012, #008080, #1A1A1A, #008080, #3C2012)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A1109', '--theme-input-border': '#332211', '--theme-text-color-light': '#D0C0B0'
    },
    "Ocean Mist": {
        '--theme-color-1': '#4682B4', '--theme-color-2': '#66CDAA', '--theme-color-3': '#2E5984',
        '--theme-highlight-color': '#7EC0EE', '--theme-hover-color': '#9FC0DA',
        '--theme-glow-color': 'rgba(70, 130, 180, 0.4)', '--theme-message-box-shadow': 'rgba(102, 205, 170, 0.5)',
        '--theme-powered-by-color': '#5A90B8', '--theme-crimson-x-gradient': 'linear-gradient(to right, #4682B4, #7EC0EE, #9FC0DA, #7EC0EE, #4682B4)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A2F3D', '--theme-input-border': '#334F66', '--theme-text-color-light': '#E0F0FF'
    },
    "Volcanic Dawn": {
        '--theme-color-1': '#333333', '--theme-color-2': '#FF4500', '--theme-color-3': '#555555',
        '--theme-highlight-color': '#777777', '--theme-hover-color': '#AAAAAA',
        '--theme-glow-color': 'rgba(255, 69, 0, 0.4)', '--theme-message-box-shadow': 'rgba(119, 119, 119, 0.3)',
        '--theme-powered-by-color': '#666666', '--theme-crimson-x-gradient': 'linear-gradient(to right, #333333, #FF4500, #AAAAAA, #FF4500, #333333)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A1A1A', '--theme-input-border': '#333333', '--theme-text-color-light': '#BBBBBB'
    },
    "Solar Teal": {
        '--theme-color-1': '#008080', '--theme-color-2': '#FFD700', '--theme-color-3': '#00AAAA',
        '--theme-highlight-color': '#00CCCC', '--theme-hover-color': '#00FFFF',
        '--theme-glow-color': 'rgba(0, 128, 128, 0.4)', '--theme-message-box-shadow': 'rgba(255, 215, 0, 0.5)',
        '--theme-powered-by-color': '#009999', '--theme-crimson-x-gradient': 'linear-gradient(to right, #008080, #FFD700, #00AAAA, #FFD700, #008080)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A2A2A', '--theme-input-border': '#334D4D', '--theme-text-color-light': '#E0FFFF'
    },
    "Grapevine": {
        '--theme-color-1': '#5D3FD3', '--theme-color-2': '#800080', '--theme-color-3': '#9370DB',
        '--theme-highlight-color': '#A672FF', '--theme-hover-color': '#C0A0FF',
        '--theme-glow-color': 'rgba(140, 82, 255, 0.4)', '--theme-message-box-shadow': 'rgba(128, 0, 128, 0.5)',
        '--theme-powered-by-color': '#7540E0', '--theme-crimson-x-gradient': 'linear-gradient(to right, #5D3FD3, #A672FF, #C0A0FF, #A672FF, #5D3FD3)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#2A1A3A', '--theme-input-border': '#4C3366', '--theme-text-color-light': '#F0E0FF'
    },
    "Tropical Lagoon": {
        '--theme-color-1': '#00BFFF', '--theme-color-2': '#20B2AA', '--theme-color-3': '#40E0D0',
        '--theme-highlight-color': '#66CCFF', '--theme-hover-color': '#99DDFF',
        '--theme-glow-color': 'rgba(0, 191, 255, 0.4)', '--theme-message-box-shadow': 'rgba(32, 178, 170, 0.5)',
        '--theme-powered-by-color': '#00A0E0', '--theme-crimson-x-gradient': 'linear-gradient(to right, #00BFFF, #66CCFF, #99DDFF, #66CCFF, #00BFFF)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A2A3D', '--theme-input-border': '#334D66', '--theme-text-color-light': '#E0FFFF'
    },
    "Neon Genesis": {
        '--theme-color-1': '#FF00FF', '--theme-color-2': '#00FFFF', '--theme-color-3': '#FFFF00',
        '--theme-highlight-color': '#FF33FF', '--theme-hover-color': '#FF66FF',
        '--theme-glow-color': 'rgba(255, 0, 255, 0.6)', '--theme-message-box-shadow': 'rgba(0, 255, 255, 0.5)',
        '--theme-powered-by-color': '#FF00CC', '--theme-crimson-x-gradient': 'linear-gradient(to right, #FF00FF, #00FFFF, #FFFF00, #00FFFF, #FF00FF)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A1A1A', '--theme-input-border': '#333333', '--theme-text-color-light': '#FFEEFF'
    },
    "Fire & Ice": {
        '--theme-color-1': '#FF0000', '--theme-color-2': '#0000FF', '--theme-color-3': '#00FFFF',
        '--theme-highlight-color': '#FF3333', '--theme-hover-color': '#FF6666',
        '--theme-glow-color': 'rgba(255, 0, 0, 0.4)', '--theme-message-box-shadow': 'rgba(0, 0, 255, 0.5)',
        '--theme-powered-by-color': '#FF00CC', '--theme-crimson-x-gradient': 'linear-gradient(to right, #FF0000, #0000FF, #00FFFF, #0000FF, #FF0000)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A1A1A', '--theme-input-border': '#333333', '--theme-text-color-light': '#E0FFFF'
    },
    "Earth & Sky": {
        '--theme-color-1': '#6B8E23', '--theme-color-2': '#87CEEB', '--theme-color-3': '#4A2C10',
        '--theme-highlight-color': '#A6B660', '--theme-hover-color': '#C0C880',
        '--theme-glow-color': 'rgba(107, 142, 35, 0.4)', '--theme-message-box-shadow': 'rgba(135, 206, 235, 0.5)',
        '--theme-powered-by-color': '#7F9A2F', '--theme-crimson-x-gradient': 'linear-gradient(to right, #6B8E23, #A6B660, #87CEEB, #A6B660, #6B8E23)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#2A2A1A', '--theme-input-border': '#4D4D33', '--theme-text-color-light': '#E0F0C0'
    },
    "Sakura Pink": {
        '--theme-color-1': '#FFB6C1', '--theme-color-2': '#FFC0CB', '--theme-color-3': '#FF69B4',
        '--theme-highlight-color': '#FFDDEE', '--theme-hover-color': '#FFF0F5',
        '--theme-glow-color': 'rgba(255, 182, 193, 0.4)', '--theme-message-box-shadow': 'rgba(255, 192, 203, 0.5)',
        '--theme-powered-by-color': '#FF99AA', '--theme-crimson-x-gradient': 'linear-gradient(to right, #FFB6C1, #FFDDEE, #FFF0F5, #FFDDEE, #FFB6C1)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A1A1A', '--theme-input-border': '#333333', '--theme-text-color-light': '#FFE8F0'
    },
    "Emerald Teal": {
        '--theme-color-1': '#008080', '--theme-color-2': '#20B2AA', '--theme-color-3': '#004C4C',
        '--theme-highlight-color': '#00AAAA', '--theme-hover-color': '#00CCCC',
        '--theme-glow-color': 'rgba(0, 128, 128, 0.4)', '--theme-message-box-shadow': 'rgba(32, 178, 170, 0.5)',
        '--theme-powered-by-color': '#009999', '--theme-crimson-x-gradient': 'linear-gradient(to right, #008080, #00AAAA, #00CCCC, #00AAAA, #008080)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A2A2A', '--theme-input-border': '#334D4D', '--theme-text-color-light': '#E0FFFF'
    },
    "Violet Sunset": {
        '--theme-color-1': '#FF4500', '--theme-color-2': '#8A2BE2', '--theme-color-3': '#4B0082',
        '--theme-highlight-color': '#FF8C00', '--theme-hover-color': '#FFA07A',
        '--theme-glow-color': 'rgba(255, 69, 0, 0.4)', '--theme-message-box-shadow': 'rgba(138, 43, 226, 0.5)',
        '--theme-powered-by-color': '#FF6600', '--theme-crimson-x-gradient': 'linear-gradient(to right, #FF4500, #FF8C00, #FFA07A, #FF8C00, #FF4500)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A1A1A', '--theme-input-border': '#333333', '--theme-text-color-light': '#FFE0E0'
    },
    "Autumn Forest": {
        '--theme-color-1': '#A0522D', '--theme-color-2': '#8B4513', '--theme-color-3': '#6B8E23',
        '--theme-highlight-color': '#CD853F', '--theme-hover-color': '#D2691E',
        '--theme-glow-color': 'rgba(160, 82, 45, 0.4)', '--theme-message-box-shadow': 'rgba(139, 69, 19, 0.5)',
        '--theme-powered-by-color': '#B35F30', '--theme-crimson-x-gradient': 'linear-gradient(to right, #A0522D, #CD853F, #D2691E, #CD853F, #A0522D)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#2A1A1A', '--theme-input-border': '#4C3333', '--theme-text-color-light': '#FFEEDD'
    },
    "Winter Wonderland": {
        '--theme-color-1': '#ADD8E6', '--theme-color-2': '#B0E0E6', '--theme-color-3': '#87CEEB',
        '--theme-highlight-color': '#E0FFFF', '--theme-hover-color': '#F0FFFF',
        '--theme-glow-color': 'rgba(173, 216, 230, 0.4)', '--theme-message-box-shadow': 'rgba(176, 224, 230, 0.5)',
        '--theme-powered-by-color': '#C0E8F0', '--theme-crimson-x-gradient': 'linear-gradient(to right, #ADD8E6, #E0FFFF, #F0FFFF, #E0FFFF, #ADD8E6)',
        '--body-bg-color': '#000000', '--theme-input-bg': '#1A2A3D', '--theme-input-border': '#334D66', '--theme-text-color-light': '#E8F8FF'
    }
};

// Function to apply theme colors
function applyTheme(themeName) {
    const root = document.documentElement;
    const colors = themeColors[themeName];

    if (colors) {
        for (const prop in colors) {
            root.style.setProperty(prop, colors[prop]);
        }
        // ตรวจสอบให้แน่ใจว่า Dropdown แสดงธีมที่ถูกต้อง
        themeSelector.value = themeName;
    }
}

// Function to update time display
function updateTime() {
    const date = new Date();
    const hour = formatTime(date.getHours());
    const minutes = formatTime(date.getMinutes());
    const seconds = formatTime(date.getSeconds());
    display.innerText = `${hour} : ${minutes} : ${seconds}`;
}

// Helper function to format time (add leading zero)
function formatTime(time) {
    return time < 10 ? '0' + time : time;
}

// Function to set alarm time from input
function setAlarmTime(value) {
    alarmTime = value;
}

// Function to toggle alarm controls visibility
function toggleAlarmControls() {
    if (alarmControls.style.display === 'none' || alarmControls.style.display === '') {
        alarmControls.style.display = 'block';
        toggleAlarmSetupBtn.style.display = 'none';
    } else {
        alarmControls.style.display = 'none';
        toggleAlarmSetupBtn.style.display = 'block';
        alarmInput.value = '';
    }
}

// Function to start the countdown display
function startCountdown() {
    stopCountdown();
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

// Function to stop the countdown display
function stopCountdown() {
    clearInterval(countdownInterval);
    countdownInterval = null;
    countdownDisplay.innerText = '';
}

// Function to update the countdown text
function updateCountdown() {
    if (!alarmTime) {
        stopCountdown();
        return;
    }

    const timeToAlarm = new Date(alarmTime).getTime();
    const currentTime = new Date().getTime();
    const timeRemaining = timeToAlarm - currentTime;

    const alarmDate = new Date(alarmTime);
    const alarmHour = formatTime(alarmDate.getHours());
    const alarmMinute = formatTime(alarmDate.getMinutes());
    const alarmSecond = formatTime(alarmDate.getSeconds());
    const formattedAlarmTime = `${alarmHour}:${alarmMinute}:${alarmSecond}`;

    const alarmDay = alarmDate.getDate();
    const alarmMonth = thaiMonths[alarmDate.getMonth()];
    const alarmYear = alarmDate.getFullYear();

    if (timeRemaining <= 0) {
        stopCountdown();
        if (audio.paused) {
             countdownDisplay.innerHTML = '';
        } else {
            countdownDisplay.innerHTML = 'ปลุกแล้ว!';
        }
        return;
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    let countdownText = `นาฬิกาปลุกได้ถูกตั้งค่าไว้แล้วที่ ${alarmDay} ${alarmMonth} ${alarmYear} เวลา ${formattedAlarmTime}<br>`;
    let remainingTimePart = '';
    if (days > 0) {
        remainingTimePart += `${days} วัน `;
    }
    remainingTimePart += `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
    
    countdownText += `เหลือเวลาอีก ${remainingTimePart} นาฬิกาปลุกจะทำงาน`;
    
    countdownDisplay.innerHTML = countdownText;
}

// Function to set the alarm
function setAlarm() {
    if(alarmTime) {
        const current = new Date();
        const timeToAlarm = new Date(alarmTime);

        if (timeToAlarm > current) {
            const timeout = timeToAlarm.getTime() - current.getTime();
            alarmTimeout = setTimeout(() => {
                audio.play();
                stopCountdown();
                mainClearAlarmBtn.style.display = 'block';
                countdownDisplay.innerHTML = 'ปลุกแล้ว!'; 
            }, timeout);
            
            startCountdown();
            const messageBox = document.createElement('div');
            messageBox.innerText = 'ตั้งปลุก เรียบร้อย';
            messageBox.classList.add('custom-message-box');
            document.body.appendChild(messageBox);
            setTimeout(() => {
                document.body.removeChild(messageBox);
            }, 2000);

            toggleAlarmControls();
            mainClearAlarmBtn.style.display = 'block';
        } else {
            const messageBox = document.createElement('div');
            messageBox.innerText = 'ไม่สามารถตั้งปลุกในอดีตได้ กรุณาเลือกเวลาในอนาคต';
            messageBox.classList.add('custom-message-box');
            document.body.appendChild(messageBox);
            setTimeout(() => {
                document.body.removeChild(messageBox);
            }, 3000);
        }
    } else {
        const messageBox = document.createElement('div');
        messageBox.innerText = 'กรุณาเลือกเวลาที่จะตั้งปลุกก่อน';
        messageBox.classList.add('custom-message-box');
        document.body.appendChild(messageBox);
        setTimeout(() => {
            document.body.removeChild(messageBox);
        }, 2000);
    }
}

// Function to clear the alarm
function clearAlarm() {
    audio.pause();
    if (alarmTimeout) {
        clearTimeout(alarmTimeout);
        const messageBox = document.createElement('div');
        messageBox.innerText = 'เคลียข้อมูลนาฬิกาปลุก เรียบร้อย';
        messageBox.classList.add('custom-message-box');
        document.body.appendChild(messageBox);
        setTimeout(() => {
            document.body.removeChild(messageBox);
        }, 2000);

        alarmTimeout = null;
    } else {
        const messageBox = document.createElement('div');
        messageBox.innerText = 'ไม่มีนาฬิกาปลุกที่ตั้งไว้';
        messageBox.classList.add('custom-message-box');
        document.body.appendChild(messageBox);
        setTimeout(() => {
            document.body.removeChild(messageBox);
        }, 2000);
    }
    stopCountdown();
    mainClearAlarmBtn.style.display = 'none';
    alarmTime = null;
}

// Event Listeners for buttons
toggleAlarmSetupBtn.addEventListener('click', toggleAlarmControls);
cancelAlarmSetupBtn.addEventListener('click', () => {
    toggleAlarmControls();
});
mainClearAlarmBtn.addEventListener('click', clearAlarm);

// --- Theme navigation with arrow buttons ---
const themeNames = Object.keys(themeColors);

// Populate theme selector dropdown dynamically
function populateThemeSelector() {
    themeSelector.innerHTML = ''; // Clear existing options
    themeNames.forEach(themeName => {
        const option = document.createElement('option');
        option.value = themeName;
        option.textContent = themeName;
        themeSelector.appendChild(option);
    });
}


prevThemeBtn.addEventListener('click', () => {
    let currentIndex = themeNames.indexOf(themeSelector.value);
    let newIndex = (currentIndex - 1 + themeNames.length) % themeNames.length;
    applyTheme(themeNames[newIndex]);
});

nextThemeBtn.addEventListener('click', () => {
    let currentIndex = themeNames.indexOf(themeSelector.value);
    let newIndex = (currentIndex + 1) % themeNames.length;
    applyTheme(themeNames[newIndex]);
});

// Update time every second
setInterval(updateTime, 1000);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    mainClearAlarmBtn.style.display = 'none';
    populateThemeSelector(); // Populate dropdown on load
    applyTheme('Crimson Red'); // กำหนดธีมเริ่มต้นเมื่อโหลดหน้าเว็บ
});

let gravity:number = 0.05
let entities:entity[] = []
let ui_stars:ui_star[];
let stars:number = 0
let prev_stars: number;
let level_id:number;
let score:number;
let points:number;
let points_y:number = 24
let show_transparent:boolean = true;
let high_score:number;

let win_screen_y:number;
let win_screen_target_y:number;
let menu_id:number;
let input_enabled:boolean = true
let timers: any[][];
let clouds:any[];
let world_width: number;
let max_level_id:number;
level_id = 0;
let prompts = [
    "press A to start moving",
    "press A twice to wall jump",
    "watch out for pointy things"
]


let cam = { x: screen.width / 2, y: screen.height / 2 };
//cart data
let cartName = "yarn"
let dkeystar = "stars"
let dkeyscore = "score"
let dkeymaxlvl = "maxlvl"

function dSetLevelStar(lvl: number, data: number) {
    blockSettings.writeNumber(cartName + dkeystar + lvl, data)
}

function dGetLevelStar(lvl: number): number {
    return blockSettings.readNumber(cartName + dkeystar + lvl) || 0
}

function dSetLevelScore(lvl: number, data: number) {
    blockSettings.writeNumber(cartName + dkeyscore + lvl, data)
}

function dGetLevelScore(lvl: number): number {
    return blockSettings.readNumber(cartName + dkeyscore + lvl) || 0
}

function dGetMaxLevel(): number {
    return blockSettings.readNumber(cartName + dkeymaxlvl) || 0
}

function dSetMaxLevel(data: number) {
    blockSettings.writeNumber(cartName + dkeymaxlvl, data)
}

function set_timer(frames:number,func:Function) {
    timers = timers || []
    timers.push([frames,func]);
}

function mapdrawImage(from: Image, x: number, y: number, flip_x?: boolean, flip_y?: boolean, isNotTransparent?:boolean) {
    if (y <= 0) {
        if (isNotTransparent) {
            screen.drawImage(from, x - scene.cameraLeft(), y - scene.cameraTop())
        } else {
            screen.drawTransparentImage(from, x - scene.cameraLeft(), y - scene.cameraTop())
        }
    } else {
        if (scene.cameraTop() <= y && y <= (scene.cameraTop() + screen.height)) {
            if (flip_x) {
                from.flipX()
            }
            if (flip_y) {
                from.flipY()
            }
            if (isNotTransparent) {
                screen.drawImage(from, x - scene.cameraLeft(), y - scene.cameraTop())
            } else {
                screen.drawTransparentImage(from, x - scene.cameraLeft(), y - scene.cameraTop())
            }
        } else {
            if (isNotTransparent) {
                screen.drawImage(from, x - scene.cameraLeft(), y - scene.cameraTop())
            } else {
                screen.drawTransparentImage(from, x - scene.cameraLeft(), y - scene.cameraTop())
            }
        }
    }
}

function action() :boolean{
    return controller.A.isPressed() || controller.B.isPressed()
}

function each_entity(callback:Function) {
    for (let entity of entities) {
        callback(entity)
    }
}

function collide(obj:entity,other:entity) {
    return (other.x + other.hitbox.x < obj.x + obj.hitbox.x + obj.hitbox.width - 1)
        && (other.x + other.hitbox.x + other.hitbox.width - 1 > obj.x + obj.hitbox.x)
        && (other.y + other.hitbox.y < obj.y + obj.hitbox.y + obj.hitbox.height - 1)
        && (other.y + other.hitbox.y + other.hitbox.height > obj.y + obj.hitbox.y)
}

function mapPrint(text: string, x: number, y: number, color?: number) {
    if (scene.cameraTop() < y && y < (scene.cameraTop() + screen.height)) {
        screen.print(text, x-scene.cameraLeft(), y - scene.cameraTop(), color, image.font5)
    }
}

function mapPrint2(text: string, x: number, y: number, color?: number) {
    if (scene.cameraTop() < y && y < (scene.cameraTop() + screen.height)) {
        screen.print(text, x - scene.cameraLeft(), y - scene.cameraTop(), color, image.font12)
    }
}

function printc(str:string, y:number, c:number, c2:number) {
    y = y || 64
    c = c || 7
    c2 = c2 || 6
    let x = 64 - Math.floor((str.length * 4) / 2)

    mapPrint(str, x, y + 1, c2)
    mapPrint(str, x, y, c)
}

function add_points(pts:number) {
    points = pts
    points_y = 16
    score += points
}

function spr(n: number, x: number, y: number, w?: number, h?: number, flip_x?: boolean, flip_y?: boolean) {
    if (n == 1) {
        mapdrawImage(assets.image`myImage81`, x, y, flip_x, flip_y)
    } else if (n == 2) {
        mapdrawImage(assets.image`myImage50`, x, y, flip_x, flip_y)
    } else if (n == 4) {
        mapdrawImage(assets.image`myImage72`, x, y, flip_x, flip_y)
    } else if (n == 6) {
        mapdrawImage(assets.image`myImage73`, x, y, flip_x, flip_y)
    } else if (n == 34) {
        mapdrawImage(assets.image`myImage77`, x, y, flip_x, flip_y)
    } else if (n == 36) {
        mapdrawImage(assets.image`myImage78`, x, y, flip_x, flip_y)
    } else if (n == 38) {
        mapdrawImage(assets.image`myImage79`, x, y, flip_x, flip_y)
    } else if (n == 48 ) {
        mapdrawImage(assets.image`myImage104`, x, y, flip_x, flip_y)
    } else if (n == 16) {
        mapdrawImage(assets.image`myImage12`, x, y, flip_x, flip_y)
    } else if (n == 32) {
        mapdrawImage(assets.image`myImage27`, x, y, flip_x, flip_y)
    } else if (n == 69) {
        mapdrawImage(assets.image`myImage55`, x, y, flip_x, flip_y)
    } else if (n == 70) {
        mapdrawImage(assets.image`myImage56`, x, y, flip_x, flip_y)
    } else if (n == 71) {
        mapdrawImage(assets.image`myImage57`, x, y, flip_x, flip_y)
    } else if (n == 73) {
        mapdrawImage(assets.image`myImage87`, x, y, flip_x, flip_y)
    } else if (n == 74) {
        mapdrawImage(assets.image`myImage105`, x, y, flip_x, flip_y)
    } else if (n == 75) {
        mapdrawImage(assets.image`myImage80`, x, y, flip_x, flip_y)
    } else if (n == 76) {
        mapdrawImage(assets.image`myImage106`, x, y, flip_x, flip_y,true)
    } else if (n == 82) {
        mapdrawImage(assets.image`myImage107`, x, y, flip_x, flip_y)
    } else if (n == 83) {
        mapdrawImage(assets.image`myImage109`, x, y, flip_x, flip_y)
    } else if (n == 84) {
        mapdrawImage(assets.image`myImage108`, x, y, flip_x, flip_y)
    } else if (n == 17 || n == 33 || n == 49){
        if (n == 17) {
            mapdrawImage(assets.image`myImage13`, x, y, flip_x, flip_y)
        } else if (n == 33) {
            mapdrawImage(assets.image`myImage28`, x, y, flip_x, flip_y)
        } else {
            mapdrawImage(assets.image`myImage103`, x, y, flip_x, flip_y)
        }
    } else if (n == 135) {
        mapdrawImage(assets.image`myImage41`, x, y, flip_x, flip_y)
    } else if (n == 136) {
        mapdrawImage(assets.image`myImage42`, x, y, flip_x, flip_y)
    } else if (n == 137) {
        mapdrawImage(assets.image`myImage43`, x, y, flip_x, flip_y)
    } else if (n == 104) {
        mapdrawImage(assets.image`myImage67`, x, y, flip_x, flip_y)
    } else if (n == 105) {
        mapdrawImage(assets.image`myImage68`, x, y, flip_x, flip_y)
    } else if (n == 120) {
        mapdrawImage(assets.image`myImage69`, x, y, flip_x, flip_y)
    } else if (n == 99) {
        mapdrawImage(assets.image`myImage63`, x, y, flip_x, flip_y)
    } else if (n == 100) {
        mapdrawImage(assets.image`myImage64`, x, y, flip_x, flip_y)
    } else if (n == 115) {
        mapdrawImage(assets.image`myImage65`, x, y, flip_x, flip_y)
    } else if (n == 162) {
        mapdrawImage(assets.image`myImage48`, x, y, flip_x, flip_y)
    } else if (n == 128) {
        mapdrawImage(assets.image`myImage46`, x, y, flip_x, flip_y)
    } else if (n == 160) {
        mapdrawImage(assets.image`myImage47`, x, y, flip_x, flip_y)
    } else if (n == 130) {
        mapdrawImage(assets.image`myImage44`, x, y, flip_x, flip_y)
    } else if (n == 132) {
        mapdrawImage(assets.image`myImage45`, x, y, flip_x, flip_y)
    } else if (n == 67) {
        mapdrawImage(assets.image`myImage53`, x, y, flip_x, flip_y)
    } else if (n == 68) {
        mapdrawImage(assets.image`myImage54`, x, y, flip_x, flip_y)
    } else if (n == 228){
        mapdrawImage(assets.image`myImage75`, x, y, flip_x, flip_y)
    } else if (n == 196) {
        mapdrawImage(assets.image`myImage49`, x, y, flip_x, flip_y)
    } else if (n == 151) {
        mapdrawImage(assets.image`myImage40`, x, y, flip_x, flip_y)
    } else if (n == 77) {
        mapdrawImage(assets.image`myImage111`, x, y, flip_x, flip_y)
    } else if (n == 121) {
        mapdrawImage(assets.image`myImage112`, x, y, flip_x, flip_y)
    } else if (n == 122) {
        mapdrawImage(assets.image`myImage113`, x, y, flip_x, flip_y)
    } else if (n == 123) {
        mapdrawImage(assets.image`myImage114`, x, y, flip_x, flip_y)
    }
}

function tget(mx:number, my:number) {
    return {
        x:mx * 8,
        y:my * 8,
        mx:mx,
        my:my,
        sprite:mget(mx, my)
    }
}

function allTiles(x1: number, y1: number, x2: number, y2: number) {
    let tiles = []
    for (let x = Math.floor(x1/8); x <= Math.floor(x2/8);x++) {
        for (let y = Math.floor(y1/8); y <= Math.floor(y2/8);y++) {
            tiles.push(tget(x,y))
        }
    }
    return tiles;
}

function transparent(callback:Function) {
    if (show_transparent) {
        callback()
    }
}

function sgn(t: number): number {
    return t >= 0 ? 1 : -1
}

interface Hitbox {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Animation {
    fps?: number;
    frames: number[];
    loop?: boolean;
}
interface dustProp {
    x:number,
    y?:number,
    dx?:number,
    dy?:number,
    life?:number,
    count?:number,
    vx?:number,
    vy?:number,
    c?:number,
    d?:number,
}

class customParticle {
    x:number;
    y:number;
    vx:number;
    vy:number;
    c:number;
    d:number;
    life:number;
    constructor(opts: dustProp) {
        this.x = opts.x
        this.y = opts.y
        this.vx = opts.vx || 0
        this.vy = opts.vy || - 1
        this.d = opts.d || 1
        this.c = opts.c || 7
        this.life = opts.life || 15
    }

    update() {
        this.x += this.vx
        this.y += this.vy
        this.life -= 1
        this.vy += .025
        this.vx *= .95
        this.vy *= .95
        this.d *= .95

        if (this.life <= 0) {
            myParticles.removeElement(this)
        }
    }

    draw() {
        //transparent(function() {
           // console.log("draw customParticle")
        //console.log(this.d)
            mapfillCircle(this.x, this.y, Math.ceil(this.d), this.c)
        //})
    }
}

function create_particle(opts: dustProp) {
    return new customParticle(opts)
}

function create_dust(opts: dustProp) {
    let x = opts.x
    let y = opts.y
    let dx = opts.dx || 0
    let dy = opts.dy || 0
    let life = opts.life || 15
    let count = opts.count || 10
    let d = opts.d || 2

    for (let i = 1; i <= 10; i++) {
        let pdx = (dx + (randint(0,5)/10 - 0.25) * Math.max(1, d)) || (randint(0,1)/10 - 1)
        let pdy = (dy + (randint(0, 5) / 10 - 0.25) * Math.max(1, d)) || (randint(0, 1) / 10 - 1)

        myParticles.push(create_particle({
            x:x,
            y:y,
            vx:pdx,
            vy:pdy,
            d:randint(0,d-1),
            life: life + randint(0, 29) - 15,
            c: opts.c
        }))
    }
}

function create_cloud(x?:number,y?:number,speed?:number,scale?:number) {
    clouds = clouds || []
    clouds.push({
        x:x || Math.floor(randint(0,9)) * 16,
        y:y || (8 + Math.floor(randint(0,2) * 16)),
        speed : {
            x:speed || -1 * (randint(0,9)/100)
        },
        scale:scale || 1
    })
}

function draw_clouds() {
    for (let cloud of clouds) {
        if (Math.abs(cloud.scale) >= 2) {
            //transparent(function() {
                draw_cloud(cloud, 6)
            //})
        } else {
            draw_cloud(cloud, 6, 0, 1)
            draw_cloud(cloud)
        }
    }
}

function draw_cloud(cloud: { x: number, y: number, speed: { x: number }, scale: number }, color?: number, offset_x?: number, offset_y?:number) {
    color = color || 7
    offset_x = offset_x || 0
    offset_y = offset_y || 0

    let x = cloud.x
    let y = cloud.y
    let scale = cloud.scale

    mapfillCircle(x + (offset_x * scale), y + (offset_y * scale), 4 * scale, color)
    mapfillCircle(x + (6 * scale) + (offset_x * scale), y + (offset_y * scale), 5 * scale, color)
    mapfillCircle(x + (8 * scale) + (offset_x * scale), y - 4 + (offset_y * scale), 5 * scale, color)
    mapfillCircle(x + (10 * scale) + (offset_x * scale), y + (offset_y * scale), 6 * scale, color)
    mapfillCircle(x + (13 * scale) + (offset_x * scale), y + (offset_y * scale), 3 * scale, color)
    mapfillCircle(x + (16 * scale) + (offset_x * scale), y + (offset_y * scale), 4 * scale, color)
}

function move_world_camera(speed?:number) {
    let spd = speed || .75
    let x = middleOfThree(0, (level_id * 32) - 40, world_width - 160)
    x = Math.max(0, x)
    cam.x = lerp(cam.x, x, spd)
    cam.y = 0
}

function draw_level_icon(id:number) {
    let star_count = dGetLevelStar(id)
    let levelnum = id + 1
    let x = 24 + id  * 32
    let y = 47 + (triangle(x / 128) * 96)
    draw_button(x, y, "" + levelnum, level_id == id, id > max_level_id)

    for (let i = 1; i<=star_count;i++) {
        spr(68, x + ((i - 1) * 7) - 9, y + pico8_cos((i + 1) * .5) - 15)
    }

    for (let i = star_count + 1;i <= 3; i++) {
        spr(67, x + ((i - 1) * 7) - 9, y + pico8_cos((i + 1) * .5) - 15)
    }
    
}

function triangle(x:number) {
    x = x - Math.floor(x)
    if (x >= 0.5) x = 1 - x
    return x
}

class customScene {
    constructor() {

    }

    init() {

    }

    update() {

    }

    draw() {

    }

    drawBg() {

    }
}

class world extends customScene{
    clounds:any[]
    homes:any[][]
    
    constructor() {
        super()
    }

    init() {
        this.reset_palette()
        clouds = []
        this.homes = []
        world_width = ((levels.length - 1) * 32) + 48
        for (let i = 1; i <= levels.length / 2; i++) {
            this.homes.push([Math.floor(randint(0, 254)), Math.floor(randint(0, 254))])
        }
        let clds = [-2, -1.5, -1, 1, 1.5, 2, 3];
        for (let i = 1; i <= 32; i++) {
            create_cloud(randint(0, world_width - 1), randint(0, 15) + -4, -1 * (randint(0, 9) / 100), clds[randint(0, clds.length - 1)])
        }

        for (let i = 1; i <= 32; i++) {
            create_cloud(randint(0, world_width - 1), randint(0, 15) + 120, -1 * (randint(0, 9) / 100), clds[randint(0, clds.length - 1)])
        }

        move_world_camera(0)
        scene.setBackgroundColor(1)

        
        controller.A.onEvent(ControllerButtonEvent.Pressed, function() {
            if (level_id <= max_level_id) {
                mytras.animate(function () {
                    //load_scene(gamescene)
                    game.pushScene()
                    let gs = new gameScene()
                    load_scene(gs)
                })
            } else {
                invalid()
            }
        })

        controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
            if (state == states.win && input_enabled) {
                menu_id = Math.max(1, menu_id - 1)
            }
            
            if (level_id > 0) {
                level_id -= 1
            } else {
                invalid()
            }
            

        })

        controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
            if (state == states.win && input_enabled) {
                menu_id = Math.min(3, menu_id + 1)
            }
            
            if (level_id < levels.length - 1) {
                level_id += 1
            } else {
                invalid()
            }
            

        })
    }

    reset_palette() {
        pal()
        palette.setColor(1, color.rgb(0x11, 0x1d, 0x35))
        palette.setColor(2, color.rgb(0xbe, 0x12, 0x50))
        palette.setColor(3, color.rgb(0x42, 0x21, 0x36))
        palette.setColor(5, color.rgb(0x75, 0x46, 0x65))
        palette.setColor(11, color.rgb(0xa8, 0xe7, 0x2e))
        palette.setColor(15, color.rgb(0x83, 0x76, 0x9c))//0x83769C
        palette.setColor(13, color.rgb(0xff, 0x6c, 0x24))

    }

    update() {
        move_world_camera()
        
        // if (action()) {
            
        // }
        for(let cloud of clouds) {
            cloud.x += cloud.speed.x
            if (cloud.x < - (24 * cloud.scale)) {
                cloud.x = world_width
            }
        }
    }

    draw() {
        
        let bits = [16, 4, 2, 32, 8, 1, 128, 64]
        let offsets = [[0,-6],[8,2],[-8,2],[16,10],[0,10],[-16,10],[8,18],[-8,18]]

        for (let x = Math.floor(cam.x) - 48;x <= (Math.floor(cam.x) + 176);x++) {
            let y = 48 + (triangle(x / 128) * 96)
            mapfillCircle(x,y,12,0)
        }
        for (let id = 1; id <= this.homes.length; id++) {
            
            let x = 24 + ((id * 2) - 1) * 32
            let y = 8 + ((triangle((x + 64) / 128) * 128) * 1.25)
            let house = this.homes[id-1]
            let display = house[0]
            let style = house[1]

            for (let i = 0; i < bits.length;i++) {
                spr(
                    (style & bits[i]) == bits[i] ? 128 : 160,
                    x + offsets[i][0],
                    y + offsets[i][1] + 4,
                    2,
                    2
                )
            }
            spr(162, x - 2, y + 26, 2, 2)

            for (let i = 0; i < bits.length;i++) {
                let tall = (style & bits[i]) == bits[i]

                if ((display & bits[i]) == bits[i]) {
                    spr(
                        tall ? 132 : 130,
                        x + offsets[i][0],
                        y + offsets[i][1] + (tall ? - 8 : 0),
                        2,
                        tall ? 3 : 2
                    )
                }
            }

        }

        for (let i = Math.max(level_id - 4, 0); i<=Math.min(level_id + 4,levels.length-1);i++) {
            draw_level_icon(i)
        }

        draw_clouds()
    }

    drawBg() {

    }
}
let ballSprite: Sprite;
let state:any = null
class title extends customScene{
    constructor() {
        super()
        
    }

    init() {
        cam = { x: 0, y: 0 }

        pal()
        palette.setColor(3, color.rgb(0x11, 0x1d, 0x35))
        palette.setColor(10, color.rgb(0xFF, 0xEF, 0x7D))
        palette.setColor(11, color.rgb(0xA8, 0xE7, 0x2E))
        palette.setColor(12, color.rgb(0x49, 0x33, 0x3B))
        palette.setColor(13, color.rgb(0xFF, 0x6C, 0x24))
        palette.setColor(14, color.rgb(0xBE, 0x12, 0x50))
        palette.setColor(15, color.rgb(0x74, 0x2F, 0x29))

        clouds = []

        for (let i = 1; i <= 8; i++) {
            create_cloud()
        }

        initialize_eyes()
        update_eye_position()
        ballSprite = sprites.create(assets.image`myImage74`, SpriteKind.Player)
        scene.setBackgroundColor(1)
    }

    update() {
        if (action()) {
            mytras.animate(function() {
                ballSprite.destroy()
                let ws = new world()
                load_scene(ws)
            })
        }
        for(let cloud of clouds) {
            cloud.x += cloud.speed.x
            if (cloud.x < -24) {
                cloud.x = 136 + 32
            }
        }
    }

    draw() {
        draw_character()
        draw_x_button(58+12, 106-4)
        mapPrint("press", 30, 104 - 4, 3)
        mapPrint("press", 30, 103 - 4, 7)
        mapPrint("to start", 68 + 16, 104 - 4, 3)
        mapPrint("to start", 68 + 16, 103 - 4, 7)

        draw_score_ui()
    }

    drawBg() {
        mapfillCircle(16, 56, 32, 10)
        draw_clouds()
        draw_buildings()
        spr(196, 6, 54, 2, 2)
        spr(196, 132, 58, 2, 2, true)

        spr(151, 28+16, 6, 9, 7)
    }

}
let myParticles: customParticle[];

class gameScene extends customScene {
    winning: boolean;
    win_word: string;
    mplayer: player;
    new_high_score:boolean;
    constructor() {
        super()
        this.winning = false
    }

    draw_prompt() {
        let prompt = prompts[level_id] || "press A to start"
        rectfill(scene.cameraLeft(), scene.cameraTop() + 80, scene.cameraLeft() + 160, scene.cameraTop() + 101-8, 0)
        mapPrint(prompt, scene.cameraLeft() + 8, scene.cameraTop() + 93-8, 5)
        mapPrint(prompt, scene.cameraLeft() + 8, scene.cameraTop() + 92-8, 7)
    }

    draw_top_interface() {
        let y = 4
        for (let star of ui_stars) {
            star.draw()
        }

        transparent(function () {
            if (points > 0 && points_y < 26) {
                let point_str = "+" + points.toString()
                mapPrint(point_str, scene.cameraLeft() + 141 - (point_str.length * 4), scene.cameraTop() + points_y, 6)
            }
        })


        mapPrint("score", scene.cameraLeft() + 121, scene.cameraTop() + y + 5, 3)
        mapPrint("score", scene.cameraLeft() + 121, scene.cameraTop() + y + 4, 6)
        mapPrint('' + score, scene.cameraLeft() + 141 - (score.toString().length * 4), scene.cameraTop() + y + 13, 3)
        mapPrint('' + score, scene.cameraLeft() + 141 - (score.toString().length * 4), scene.cameraTop() + y + 12, 7)
    }

    draw_bottom_interface() {
        let y = 107
        if (high_score > 0 && !this.new_high_score) {
            mapPrint("high score", scene.cameraLeft() + 8, scene.cameraTop() + y + 1 - 8, 3)
            mapPrint("high score", scene.cameraLeft() + 8, scene.cameraTop() + y - 8, 6)
            mapPrint(high_score.toString(), scene.cameraLeft() + 8, scene.cameraTop() + y + 9 - 6, 3)
            mapPrint(high_score.toString(), scene.cameraLeft() + 8, scene.cameraTop() + y + 8 - 6, 7)
        }
    }

    draw_interface() {
        this.draw_top_interface()
        this.draw_bottom_interface()
    }

    resetPalette() {
        pal()
        palette.setColor(0, color.rgb(0x11, 0x1d, 0x35))
        palette.setColor(1, color.rgb(0x75, 0x46, 0x65))
        palette.setColor(2, color.rgb(0xbe, 0x12, 0x50))
        palette.setColor(3, color.rgb(0x42, 0x21, 0x36))
        palette.setColor(11, color.rgb(0xA8, 0xE7, 0x2E))
        palette.setColor(14, color.rgb(0x06, 0x5A, 0xB5))
        palette.setColor(5, color.rgb(0x83, 0x76, 0x5c))
        palette.setColor(13, color.rgb(0xFF, 0x6C, 0x24))
        palette.setColor(15, color.rgb(0xFF, 0x9D, 0x81))
    }
    
    reset() {
        this.resetPalette()
        scene.setBackgroundColor(1)
        this.win_word = ""
        myParticles = []
        load_level(level_id)
        state = states.ready;
        cam = { x: screen.width / 2, y: screen.height / 2 };
        this.new_high_score = false
        this.winning = false
    }

    init() {
        this.reset()
        game.onShade(function () {
            scene.centerCameraAt(cam.x + screen.width / 2, cam.y + screen.height / 2)
            if (currentScene) {
                currentScene.draw()
            }
            mytras.draw()
        })

        game.onPaint(function () {
            if (currentScene) {
                currentScene.drawBg()
            }
        })
        game.onUpdate(function () {
            if (currentScene) {
                currentScene.update()
            }
            frame = frame >= 60 ? 1 : frame + 1
            show_transparent = !show_transparent

            for (let timer of timers) {
                timer[0] -= 1
                if (timer[0] <= 0) {
                    timer[1]()
                    timers.removeElement(timer)
                }
            }

            mytras.update()
        })

        controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
            if (state == states.win && input_enabled) {
                menu_id = Math.max(1, menu_id - 1)
            }

        })

        controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
            if (state == states.win && input_enabled) {
                menu_id = Math.min(3, menu_id + 1)
            }
        })

        controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
            if (state == states.ready) {
                state = states.playing;
                this.mplayer.mspeed.x = 0.65
            } else if (state == states.win && input_enabled) {
                mytras.animate(function () {
                    if (menu_id == 3) {
                        if (level_id < levels.length - 1) {
                            level_id += 1
                            this.reset()
                        } else {
                            game.popScene()
                            let endingscene = new ending()
                            load_scene(endingscene)
                        }
                    } else if (menu_id == 2) {
                        this.reset()
                    } else if (menu_id == 1) {
                        game.popScene()
                        let wd = new world()
                        load_scene(wd)
                    }
                }, 192, false);
            }

        })
    }

    update() {
        let target = this.mplayer || { x: cam.x, y: cam.y, mspeed: { x: 0 } }
        state.update(this)
        each_entity(function (entity: entity) {
            entity.update()
            animate(entity)
        })

        for(let pe of myParticles) {
            pe.update()
        }

        points_y = lerp(points_y, 32, .98)
        cam = {
            x: lerp(cam.x, middleOfThree(0, Math.floor(target.x - 80 + (sgn(target.mspeed.x) * 32)), (level_width * 8) - 160), .95),
            y: lerp(cam.y, middleOfThree(0, Math.floor(target.y - 64), (level_height * 8) - screen.height), .95)
        }
    }

    draw() {
        for (let pe of myParticles) {
            pe.draw()
        }
        each_entity(function (entity: entity) {
            entity.draw()
        })
        state.draw(this)
    }

    drawBg() {
        rectfill(8, 8, (level_width * 8) - 8, (level_height * 8) - 8, 12)
    }
}

class ending extends customScene {
    constructor() {
        super()
    }
    init() {
        cam = { x: 0, y: 0 }

        pal()
        palette.setColor(3, color.rgb(0x11, 0x1d, 0x35))
        palette.setColor(10, color.rgb(0xFF, 0xEF, 0x7D))
        palette.setColor(11, color.rgb(0xA8, 0xE7, 0x2E))
        palette.setColor(12, color.rgb(0x49, 0x33, 0x3B))
        palette.setColor(13, color.rgb(0xFF, 0x6C, 0x24))
        palette.setColor(14, color.rgb(0xBE, 0x12, 0x50))
        palette.setColor(15, color.rgb(0x74, 0x2F, 0x29))

        clouds = []

        for (let i = 1; i <= 8; i++) {
            create_cloud(null,randint(0,1)*16)
        }

        initialize_eyes()
        update_eye_position()
        ballSprite = sprites.create(assets.image`myImage74`, SpriteKind.Player)
        scene.setBackgroundColor(1)

        controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
            mytras.animate(function () {
                ballSprite.destroy()
                let ws = new world()
                load_scene(ws)
            })
        })
    }

    update() {
        // if (action()) {
        //     mytras.animate(function () {
        //         ballSprite.destroy()
        //         let ws = new world()
        //         load_scene(ws)
        //     })
        // }
        for (let cloud of clouds) {
            cloud.x += cloud.speed.x
            if (cloud.x < -24) {
                cloud.x = 136 + 32
            }
        }
    }

    draw() {
        draw_character(60)
        draw_x_button(58 + 12 - 8, 106 - 4)
        mapPrint("press", 30-8, 104 - 4, 3)
        mapPrint("press", 30 - 8, 103 - 4, 7)
        mapPrint("to continue", 68 + 16 - 8, 104 - 4, 3)
        mapPrint("to continue", 68 + 16 - 8, 103 - 4, 7)

        for (let i = 1 ; i <= 3; i++) {
            let x = 8 + pico8_sin((game.runtime()/1000 - (i * .75)) / 2) * 3
            let y = 60 + pico8_cos((game.runtime() / 1000 - (i * .75)) / 2)
            pset(x, y, 10)
        }

        for (let i = 1; i <= 3; i++) {
            let x = 144 + pico8_sin((game.runtime() / 1000 - (i * .75)) / 2) * 3
            let y = 64 + pico8_cos((game.runtime() / 1000 - (i * .75)) / 2)
            pset(x, y, 10)
        }

        rectfill(16, 12, 111+32, 45, 3)


        for (let i = 16; i <=104+32; i+=8) {
            spr(121,i,6)
            spr(121, i, 44, 1, 1, false, true)
        }

        for (let i = 12; i <= 40; i += 8) {
            spr(122, 8, i)
            spr(122, 112+32, i, 1, 1, true, false)
        }

        spr(123, 112 + 32, 40)
        spr(123, 9, 42, 1, 1, true)
        spr(123, 9, 10, 1, 1, true, true)
        spr(123, 112 + 32, 10, 1, 1, false, true)

        printc("you've won. for now.", 16, 7, 11)
        printc("But the cats will ", 28, 7, 1)
        printc("wake up again", 36, 7, 1)
        draw_score_ui()
    }

    drawBg() {
        mapfillCircle(16, 56, 32, 10)
        draw_clouds()
        draw_buildings()
        spr(77, 6, 54, 2, 2)
        spr(77, 132, 58, 2, 2, true)
    }
}

class transition {
    y:number
    color:number
    speed:number
    running:boolean
    executed:boolean
    target:number
    drips:{x:number,y:number}[]
    callback:Function;
    constructor() {
        this.y = -192
        this.color = 11
        this.speed = .92
        this.running = false
        this.executed = false
        this.target = 192
        this.drips = []
        for (let i = 19;i >= 0; i--) {
            this.drips.push({x:i*8,y:randint(0,23)})
        }
    }

    animate(callback:Function,target?:number,reset?:boolean) {
        if (reset == true || reset == null) {
            this.y = -192
        }
        this.running = true
        this.executed = false
        this.callback = callback
        this.target = target || 192
        input_enabled = false

        
    }

    update() {
        if (this.running) {
            if (Math.abs(this.target - this.y) <= 1) {
                this.y = this.target
            } else if (this.executed || this.y < this.target /2) {
                this.y = lerp(this.y, this.target, this.speed)
            }

            if (this.y >= -192 + ((this.target + 192) / 2) && !this.executed) {
                this.executed = true

                if (this.callback) {
                    this.callback()
                }
            }

            if (this.y >= this.target) {
                this.running = false
                input_enabled = true
            }
        }
    }

    draw() {
        for (let drip of this.drips) {
            mapfillCircle(scene.cameraLeft() + drip.x + 4, scene.cameraTop() + this.y - drip.y, 4, this.color)
            mapfillCircle(scene.cameraLeft() + drip.x + 4, scene.cameraTop() + this.y + 128 + drip.y, 4, this.color)
            rectfill(scene.cameraLeft() + drip.x, scene.cameraTop() + this.y - drip.y, scene.cameraLeft() + drip.x + 8, scene.cameraTop() + this.y + 128 + drip.y, this.color)
        }
    }
}

class entity {
    animations: { [name: string]: Animation } 
    animation: Animation
    frame:number
    x: number;
    y: number;
    kind:string;
    hitbox:Hitbox
    sprite:number
    constructor() {
        this.hitbox = {
            x:0,
            y:0,
            width:8,
            height:8
        }
        entities.push(this)
    }

    update() {

    }

    draw() {

    }

    animate(name:string) {
        this.animation = this.animations[name]
        this.frame = 0
    }

    destroy() {
        entities.removeElement(this)
    }
}

class star extends entity {
    width:number;
    height:number;
    constructor (x:number,y:number){
        super()
        this.kind = "star";
        this.x = x;
        this.y = y;
        this.width = 8;
        this.height = 8;
        this.animations = {
            "idle": {
                "fps": 6,
                "frames": [17, 33, 49, 49, 33],
                "loop": true
            }
        }
        this.animate("idle")
    }
    draw() {
        let offset = this.frame > 3 ? -1 : 0
        spr(this.sprite, this.x + offset, this.y, 1, 1, this.frame > 3)
    }
}

class pow extends entity {
    width: number;
    height: number;
    constructor(x: number, y: number) {
        super()
        this.x = x
        this.y = y
        this.width = 16
        this.height = 16
        this.frame = 0
    }

    update() {
        this.frame+=1
    }

    draw() {
       if (this.frame < 4) {
           if (this.frame % 2 == 0) {
               spr(69,this.x+4,this.y+4)
           }
       } else if (this.frame < 8) {
           if (this.frame %2 == 0) {
               spr(70,this.x+4,this.y+4)
           }
       } else {
           spr(71,this.x,this.y)
       }
    }
}

class cat extends entity{
    z: number;
    width: number;
    height: number;
    constructor(x: number, y: number) {
        super()
        this.kind = "cat"
        this.x = x;
        this.y = y - 8
        this.z = 1
        this.width = 16
        this.height = 16
        this.hitbox = {
            x: 0,
            y: 0,
            width: 16,
            height: 16
        };
        this.animations = {
            "idle": {
                "frames": [2],
            }
        }
        this.animate("idle")
    }

    draw() {
        spr(this.sprite, this.x, this.y)
    }

    die() {
        new pow(this.x+2,this.y+2)
    }
}

class spike extends entity {
    width: number;
    height: number;
    constructor(x:number,y:number,sprite?:number) {
        super()
        let sp = sprite || 83
        this.kind = 'spike'
        this.x = x
        this.y = y
        this.width = 8
        this.height = 8
        this.sprite = sp
        this.hitbox = {
            x: 0,
            y: 2,
            width: 8,
            height: 6
        }

        if (this.sprite == 82) {
            this.hitbox = {
                x: 4,
                y: 3,
                width: 8,
                height: 5
            }
        } else if (this.sprite == 84) {
            this.hitbox = {
                x: 0,
                y: 3,
                width: 5,
                height: 5
            }
        }
    }
    draw() {
        spr(this.sprite, this.x, this.y)
    }
}

class saw extends entity {
    width: number;
    height: number;
    z:number;
    flipx:boolean;
    flipy:boolean;
    constructor(x:number,y:number,d?:string) {
        super()
        let frames: number[];
        this.kind = "saw"
        this.x = x
        this.y = y
        this.z = 1,
        this.width = 8
        this.height = 8
        this.sprite = 99
        
        let dir = d || 'up'
        let flipx = false
        let flipy = false
        if (dir == "right") {
            this.hitbox = {
                x: 0,
                y: 1,
                width: 5,
                height: 6
            }
            frames = [104, 105, 120]
        } else if (dir == 'down') {
            this.hitbox = {
                x: 1,
                y: 0,
                width: 6,
                height: 5
            }
            frames = [99, 100, 115]
            flipy = true
        } else if (dir == 'left') {
            this.hitbox = {
                x: 3,
                y: 1,
                width: 5,
                height: 6
            }
            frames = [104, 105, 120]
            flipx = true
        } else {
            this.hitbox = {
                x: 1,
                y: 3,
                width: 6,
                height: 5
            }
            frames = [99, 100, 115]
        }
        this.flipx = flipx
        this.flipy = flipy
        this.animations = {
            "idle": {
                "fps": 30,
                "frames": frames,
                "loop":true
            }
        }
        this.animate("idle")
    }

    draw() {
        spr(this.sprite, this.x, this.y, 1, 1, this.flipx, this.flipy)
    }
}

interface position {
    x:number;
    y:number;
}

interface speed {
    x:number;
    y:number;
}
class player extends entity {
    z: number;
    width: number;
    height: number;
    ground:boolean;
    wall:boolean;
    flip:boolean;
    jump_available:boolean;
    prev_pos: position[];
    mspeed: speed;
    constructor(x:number,y:number) {
        super()
        this.kind = "player"
        this.x = x;
        this.y = y 
        this.width = 8
        this.height = 8
        this.ground = true
        this.wall = true
        this.flip = false
        this.prev_pos = []
        for(let i = 0; i < 6; i++) {
            this.prev_pos.push({
                x:x,
                y:y
            })
        }
        this.mspeed = {
            x:0,
            y:0
        }
        this.hitbox = {
            x: 0,
            y: 0,
            width: 6,
            height: 7
        };
        this.animations = {
            "idle": {
                "fps":1,
                "frames": [48],
            },
            "jump": {
                "fps": 6,
                "frames": [16, 32, 48],
            }
        }

        this.sprite = 48;

        this.animate("idle")
    }

    update() {
        if (frame%2 == 0) {
            for(let i = 0; i < this.prev_pos.length-1;i++) {
                this.prev_pos[i] = this.prev_pos[i + 1]
            }
            this.prev_pos[this.prev_pos.length - 1] = {
                x:this.x,
                y:this.y
            }
        }

        if (this.wall && this.mspeed.y > 0) {
            this.mspeed.y = 0.33
        } else {
            this.mspeed.y += gravity
        }

        if (this.mspeed.x < 0) {
            this.flip = true
        } else {
            this.flip = false
        }

        this.resolve_map_collision()
        this.detect_ground()
        this.detect_wall()
    }

    resolve_map_collision() {
        let speed = this.mspeed
        let max_speed = Math.max(Math.abs(speed.x), Math.abs(speed.y))
        let steps = Math.ceil(max_speed/8)
        for (let step = 1; step <= steps; step++) {
            if (speed.x != 0) {
                this.x += (speed.x / steps)
                this.on_map_collision(function (tile: {
                    x: number,
                    y: number,
                    mx: number,
                    my: number,
                    sprite: number}) {
                    this.x = tile.x - (8 * sgn(speed.x))
                })
            }
            if (speed.y != 0) {
                this.y += (speed.y / steps)
                this.on_map_collision(function (tile: {
                    x: number,
                    y: number,
                    mx: number,
                    my: number,
                    sprite: number
                }) {
                    this.y = tile.y - (8 * sgn(speed.y))
                    this.mspeed.y = 0
                }, this.mspeed.y > 0)
            }
        }

        
    }

    on_map_collision(callback:Function, include_semi_solid?:boolean) {
        let x = this.x
        let y = this.y
        let width = this.width
        let height = this.height
        for (let tile of allTiles(x,y,x+width-1,y+height-1)) {
            let solid = fget(tile.sprite,0)
            let semi_solid = include_semi_solid && Math.floor(this.prev_pos[this.prev_pos.length - 1].y + this.height) <= tile.y && fget(tile.sprite, 2)
            let collision = solid || semi_solid;
            if (collision) {
                callback(tile)
                break;
            }
        }
    }

    detect_ground() {
        let was_ground = this.ground
        this.ground = false
        for (let tile of allTiles(this.x, this.y + 8, this.x + 7, this.y + 8)) {
            if (fget(tile.sprite, 0) || fget(tile.sprite, 2)) {
                if (!was_ground) {
                    this.impact({ x :this.x + 3 })
                }
                this.ground = true
                this.animate("idle")
            }
        }

    }

    detect_wall() {
        let was_wall = this.wall
        this.wall = false
        let offset = this.mspeed.x > 0 ? 8 : -1
        for (let tile of allTiles(this.x + offset, this.y, this.x + offset, this.y + 7)) {
            if (fget(tile.sprite,0)) {
                if(!was_wall) {
                    this.impact({
                        x: (this.flip ? this.x : (this.x + this.width)),
                        y: this.y + 6,
                    })
                }

                this.wall = true
            }

        }

    }

    impact(opts:dustProp) {
        let x = opts.x || (this.x + (this.flip ? this.width : 0))
        let y = opts.y || (this.y + this.height)
        let dx = opts.dx
        let dy = opts.dy

        create_dust({
            x : x,
            y : y,
            dx : dx,
            dy : dy,
            life : 30
        })
    }

    jump() {
        if (this.ground && this.wall) {
            this.animate("jump")
            this.mspeed.y = -1.125
            this.jump_available = false
        } else if (this.ground) {
            this.animate("jump")
            this.mspeed.y = -1.35
            this.jump_available = false
        } else if (this.wall) {
            this.mspeed.y=-1.35
            this.mspeed.x*=-1
            this.jump_available = false
        }
    }

    draw() {

        for(let i = 1;i <= this.prev_pos.length;i++) {
            let pos = this.prev_pos[i-1]
            let r = Math.ceil(((i + 1) / this.prev_pos.length) * 2)
            mapfillCircle(pos.x + 4, pos.y + 8 - r, r, 7)
        }
        spr(this.sprite, this.x, this.y, 1, 1, this.flip)
    }
}

class ui_star extends entity {
    width: number;
    height: number;
    constructor(x:number,y:number) {
        super()
        this.kind = "ui_star"
        this.x = x
        this.y = y
        this.width = 16
        this.height = 16

        this.animations = {
            "idle": {
                "frames": [4],
            },
            "collected": {
                "frames": [4, 6, 34, 36, 38],
                "loop":false
            }
        }
        this.animate("idle")
    }

    update() {

    }

    draw() {
        spr(this.sprite, scene.cameraLeft() + this.x, scene.cameraTop() + this.y)
    }
}


let frame:number = 0
function animate(entity: entity) {
    let animation = entity.animation
    if (animation) {
        let fps = animation.fps != null ? animation.fps:15
        if (frame%(60/fps) == 0) {
            if (entity.frame < animation.frames.length-1) {
                entity.frame+=1
            } else if (animation.loop) {
                entity.frame = 0
            }
        }
        entity.sprite = animation.frames[entity.frame]
    }
}

function mapfillCircle(cx: number, cy: number, r: number, c: number) {
    screen.fillCircle(cx - scene.cameraLeft(), cy - scene.cameraTop(), r, c)
}

function pset(cx:number,cy:number,col:number) {
    screen.setPixel(cx - scene.cameraLeft(), cy - scene.cameraTop(),col);
}

function draw_disabled_button(x: number, y: number, selected: boolean) {
    let r = 7

    if (selected) {
        mapfillCircle(x, y, r + 2, 15)
        mapfillCircle(x, y + 2, r + 2, 15)
    }

    mapfillCircle(x, y + 2, r, 3)
    mapfillCircle(x, y, r, 5)

    pset(x + r, y, 11)
    pset(x + r - 1, y, 11)
    pset(x + r - 1, y + 1, 11)
    pset(x + r, y + 1, 11)
    pset(x + r, y + 2, 11)

    pset(x - 5, y + 5, 11)
    pset(x - 6, y + 4, 11)
    pset(x - 6, y + 5, 11)
    pset(x - 6, y + 6, 11)

    pset(x, y + r, 11)
    pset(x, y + r + 1, 11)
}

function draw_enabled_button(x:number,y:number,selected:boolean) {
    let r = 8

    if (selected) {
        mapfillCircle(x, y, r + 2, 7)
        mapfillCircle(x, y + 2, r + 2, 7)
    }

    mapfillCircle(x, y + 2, r, 13)
    mapfillCircle(x, y, r, 9)
}

function draw_button(x: number, y: number, text: any, selected: boolean, disabled?:boolean) {
    if (disabled) {
        draw_disabled_button(x, y, selected)
    } else {
        draw_enabled_button(x, y, selected)
    }

    if (typeof (text) == "function") {
        text(x-3,y-3)
    } else {
        let half_text = ((text as string).length * 6) / 2
        mapPrint(text, x - half_text + 1, 1 + y - 2, disabled ? 15 : 4)
        mapPrint(text, x - half_text + 1, y - 2, 7)
    }

}

game.onShade(function () {
    scene.centerCameraAt(cam.x + screen.width/2, cam.y + screen.height / 2)
    if (currentScene) {
        currentScene.draw()
    }
    mytras.draw()
})

game.onPaint(function () {
    //hardware low fps
    // for (let x = 8; x <= (level_width * 8 - 8); x += 8) {
    //     for (let y = 8; y <= (level_height * 8 - 8); y += 8) {
    //         spr(73, x, y)
    //     }
    // }
    if (currentScene) {
        currentScene.drawBg()
    }
})
const middleOfThree = (a: number, b: number, c: number) => {
    // x is positive if a is greater than b.
    // x is negative if b is greater than a.
    let x = a - b;
    let y = b - c;
    let z = a - c;
    // Checking if b is middle (x and y both
    // are positive)
    if (x * y > 0) {
        return b;
    } else if (x * z > 0) {
        return c;
    } else {
        return a;
    }
};

namespace states {
    
    export const ready = {
        
        draw:function(gs:gameScene) {
            gs.draw_interface();
            gs.draw_prompt();
        },
        update: function (gs: gameScene) {
            
        }
    }

    export const playing = {
        draw: function (gs: gameScene) {
            gs.draw_interface()
        },
        update: function (gs: gameScene) {
            let pl = gs.mplayer
            score = Math.max(0, score - 1)
            if (action() && pl.jump_available) {
                pl.jump()
            } else if (!controller.A.isPressed()) {
                pl.jump_available = true
            }

            each_entity(function (entity: entity) {
                if (entity != gs.mplayer && collide(gs.mplayer, entity)) {
                    if (entity.kind == "star") {
                        entities.removeElement(entity)
                        stars += 1
                        add_points(100)
                        ui_stars[stars - 1].animate("collected")
                        create_dust({
                            x : entity.x + 3,
                            y : entity.y + 3,
                            dy : -1,
                            d : 3,
                            c : 10
                        })
                    } else if (entity.kind == "cat") {
                        state = states.win;
                        create_dust({
                            x : entity.x + 8,
                            y : entity.y + 8,
                            d : 4
                        });
                        scene.cameraShake();
                        (entity as cat).die()
                        entities.removeElement(entity)
                    } else if (fget(entity.sprite, 2)) {
                        state = states.lose;
                        scene.cameraShake()
                        score = 0
                        pl.destroy()

                        create_dust({
                            x : entity.x + 3,
                            y : entity.y + 3,
                            dy : -1,
                            d : 4,
                        })

                        set_timer(30, function () {
                            gs.reset()
                        })
                    }
                }
            })
        }
    }

    export const lose = {
        draw: function (gs: gameScene) {
            gs.draw_interface()
        },
        update: function (gs: gameScene) {

        }
    }

    export const win = {
        draw: function (gs: gameScene) {
            let x = cam.x
            let y = cam.y + win_screen_y
            y = Math.round(y);

            gs.draw_interface()

            rectfill(x + 4, y, x + 155, y + 108, 0)
            rectfill(x + 12, y + 101, x + 147, y + 123 - 8, 0)
            spr(76, x + 4, y + 108, 1, 1, false, true)
            spr(76, x + 148, y + 108, 1, 1, true, true)

            for (let i = stars + 1; i <= 3; i++) {
                spr(75, x + 22 + 16 + ((i - 1) * 30), y + 50-8, 3, 3)
            }

            for (let i = 1; i <= stars; i++) {
                spr(74, x + 22 + 16 + ((i - 1) * 30), y + 50-8, 3, 3)
            }
 
            let high_score_text = gs.new_high_score ? "new high score!" : "high score: " + high_score


            mapPrint2(gs.win_word, x + 80 - ((gs.win_word.length / 2) * 12), y + 35-8, 5)
            mapPrint2(gs.win_word, x + 80 - ((gs.win_word.length / 2) * 12), y + 34 - 8, 7)
        
            mapPrint('' + score, x + 80 - ((score.toString().length / 2) * 4), y + 81 - 8, 5)
            mapPrint('' + score, x + 80 - ((score.toString().length / 2) * 4), y + 80 - 8, 7)

            mapPrint(high_score_text, x + 64 - ((high_score_text.length / 2) * 4), y + 89 - 8, 6)


            draw_button(x + 56, y + 99, function (x: number, y: number) {
                spr(135, x, y)
            }, menu_id == 1)
            draw_button(x + 80, y + 99, function (x: number, y: number) {
                spr(136, x, y)
            }, menu_id == 2)
            draw_button(x + 104, y + 99, function (x: number, y: number) {
                spr(137, x, y)
            }, menu_id == 3)
        },
        update: function (gs: gameScene) {
            if (!gs.winning) {
                let words = ["oh yeah", "fantastic", "brilliant", "wonderful", "woot", "swell", "nice", "awesome", "super", "great", "wow", "pawsome"]
                gs.win_word = words[randint(0, words.length - 1)]
                gs.winning = true
                input_enabled = false

                set_timer(30, function () {
                    mytras.animate(function () {
                        win_screen_target_y = 0
                    }, -128)
                })

                if (score > high_score) {
                    high_score = score
                    gs.new_high_score = true
                }

                dSetLevelStar(level_id, Math.min(3, Math.max(stars, prev_stars)));
                dSetLevelScore(level_id,score);
                if (level_id >= max_level_id) {
                    max_level_id = level_id + 1
                    dSetMaxLevel(max_level_id)
                }

            }
            win_screen_y = lerp(win_screen_y, win_screen_target_y, .90)

            if (win_screen_y >= 0) {
                input_enabled = true
            }

            gs.mplayer.mspeed.x *= .95

        }
    }
}

game.onUpdate(function () {
    if (currentScene) {
        currentScene.update()
    }
    frame = frame >= 60 ? 1 : frame + 1
    show_transparent = !show_transparent

    for (let timer of timers) {
        timer[0] -= 1
        if (timer[0] <= 0) {
            timer[1]()
            timers.removeElement(timer)
        }
    }

    mytras.update()
})

function invalid() {
    scene.cameraShake(4, 500)
}

controller.left.onEvent(ControllerButtonEvent.Pressed, function() {
    if (state == states.win && input_enabled) {
        menu_id = Math.max(1, menu_id - 1)   
    }
})

controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (state == states.win && input_enabled) {
        menu_id = Math.min(3, menu_id + 1)
    }
})

function draw_character(y?:number) {
    y = y || 54;
    let offset = Math.floor(pico8_sin((game.runtime() / 1000 * 0.8)) * 1.5)
    ballSprite.setPosition(48+16+16, y + offset+16)
    scaling.scaleToPixels(ballSprite, 32 - offset, ScaleDirection.Vertically, ScaleAnchor.Middle)
    eyes = [
        [
            lerp(eyes[0][0], eye_frames[0][eye_pos][0], eye_speed),
            lerp(eyes[0][1], eye_frames[0][eye_pos][1], eye_speed)
        ],
        [
            lerp(eyes[1][0], eye_frames[1][eye_pos][0], eye_speed),
            lerp(eyes[1][1], eye_frames[1][eye_pos][1], eye_speed)
        ],
        [
            lerp(eyes[2][0], eye_frames[2][eye_pos][0], eye_speed),
            lerp(eyes[2][1], eye_frames[2][eye_pos][1], eye_speed)
        ]
    ]

    let eye_offset = Math.floor(offset/2)
    spr(228, eyes[0][0], eyes[0][1] + eye_offset, 3, 2)
    mapfillCircle(eyes[1][0], eyes[1][1] + eye_offset, 3, 0)//2 is not cicle
    pset(eyes[1][0] + 1, eyes[1][1] - 1 + eye_offset, 7)
    pset(eyes[1][0] + 2, eyes[1][1] - 2 + eye_offset, 7)
    pset(eyes[1][0] - 2, eyes[1][1] - 2 + eye_offset, 7)
    pset(eyes[1][0] - 2, eyes[1][1] + 2 + eye_offset, 7)
    pset(eyes[1][0] + 2, eyes[1][1] + 2 + eye_offset, 7)

    mapfillCircle(eyes[2][0], eyes[2][1] + eye_offset, 3, 0)
    pset(eyes[2][0] + 1, eyes[2][1] - 1 + eye_offset, 7)
    pset(eyes[2][0] + 2, eyes[2][1] - 2 + eye_offset, 7)
    pset(eyes[2][0] - 2, eyes[2][1] - 2 + eye_offset, 7)
    pset(eyes[2][0] - 2, eyes[2][1] + 2 + eye_offset, 7)
    pset(eyes[2][0] + 2, eyes[2][1] + 2 + eye_offset, 7)
}

function draw_x_button(x: number, y: number) {
    x = x || 58
    y = y || 106

    mapfillCircle(x, y, 5, 13)
    mapfillCircle(x, y - 1, 5, 9)
    mapPrint("A", x-2, y-3, 13)
    mapPrint("A", x-2, y-2, 7)
}

let eye_frames = [[[58 + 16, 74 - 8], [54 + 16, 74 - 8], [58 + 16, 74 - 8]], [[67 + 16, 83 - 8], [58 + 16, 80 - 8], [67 + 16, 81 - 8]], [[73 + 16, 83 - 8], [68 + 16, 81 - 8], [76 + 16, 81 - 8]]]
let eyes = [[eye_frames[0][0][0], eye_frames[0][0][1]], [eye_frames[1][0][0], eye_frames[1][0][1]], [eye_frames[2][0][0], eye_frames[2][0][1]]]
let eye_speed:number
function clear_map_data() {
    entities = []
}

function load_map_data () {
    data = ""
    count = ""

    level_width = 0
    for (let c = 0 ; c <= level.length-1;c++) {
        let char = level.substr(c, 1)
        if (myTileMap[char]){
            level_width += 1
        } else if (char == "\n" && level_width > 0) {
            break;
        }
    }
    for (let j = 1; j <= 5; j++) {
        for (let k = 1; k <= level_width;k++) {
            data = data + "w"
        }
    }
    for (let l = 0; l <= level.length-1;l++) {
        let char2 = level.substr(l, 1)
        if (parseInt(char2)) {
            count = count + char2
        } else if (myTileMap[char2]) {
            let d = parseInt(count) ? parseInt(count) : 0 
            for (let m = 1; m <= Math.max(1, d);m++) {
                data = data + char2
            }

            count = ''
        }
    }
    for (let n = 1;n <= 6;n++) {
        for(let o = 1;o <= level_width;o++) {
            data = data + "w"
        }
    }
    level_height = data.length / level_width
    
    mapsData = Buffer.create(level_width * level_height)

    for (let y3 = 0; y3 <= level_height - 1; y3++) {
        for (let x3 = 0; x3 <= level_width - 1; x3++) {
            p = y3 * level_width + x3 
            char3 = data.substr(p, 1)
            let value = myTileMap[char3]
            if (value) {
                if (typeof (value) == "function") {
                    value(x3,y3);
                } else {
                    mset(x3, y3, value)
                }
            }
        }
    }
}

function fget(sp: number,flag?:number) :number{
    if (sp == 1 ) {
        let value = 3
        if (flag == 0 || flag == 1) {
            return 1
        } else {
            return 0
        }
    } else if (sp >= 8 && sp <= 14) {
        let value = 3
        if (flag == 0 || flag == 1) {
            return 1
        } else {
            return 0
        }
    } else if (sp >= 24 && sp <= 30) {
        let value = 3
        if (flag == 0 || flag == 1) {
            return 1
        } else {
            return 0
        }
    } else if (sp >= 40 && sp <= 46) {
        let value = 3
        if (flag == 0 || flag == 1) {
            return 1
        } else {
            return 0
        }
    } else if (sp >= 56 && sp <= 62) {
        let value = 3
        if (flag == 0 || flag == 1) {
            return 1
        } else {
            return 0
        }
    } else if (sp >= 82 && sp <= 84) {
        if (flag == 2) {
            return 1
        } else if (flag == null){
            return  0x04
        } else {
            return 0
        }
    } else if (sp == 85 || sp == 104||sp==105||sp==120||sp==99||sp==100||sp==115) {
        if (flag == 2) {
            return 1
        } else if (flag == null) {
            return 0x04
        } else {
            return 0
        }
    } 
    return 0
}

function mget(c: number, r: number):number{
    return mapsData.getUint8((c | 0) + (r | 0) * level_width);
}

function autotile(map_x:number,map_y:number,map_w:number,map_h:number,flag:number,rules:any[][]) {
    for (let x = map_x; x <= map_x + map_w - 1; x++) {
        for (let y = map_y; y <= map_y + map_h - 1; y++) {
            if(fget(mget(x,y),flag) > 0) {
                let bitmask = 0
                for(let dy = -1; dy <= 1;dy++) {
                    for (let dx= -1;dx<=1; (dy == 0 ? dx+=2:dx+=1)) {
                        let bit = (1 - dy) * 3 + 1 - dx
                        bit = 1 << (bit < 4 ? bit : bit - 1)
                        if (fget(mget(x+dx,y+dy),flag) > 0||
                        (x+dx)<map_x||(x+dx)>=(map_x+map_w)||
                        (y+dy)<map_y||(y+dy)>=(map_y+map_h)) {
                            bitmask = (bitmask | bit)
                        }
                    }
                }
                for (let rule of rules) {
                    let rulemask = rule[0]
                    let sprite = rule[1]
                    let sp:number
                    if (typeof sprite == "object") {
                        let length = (sprite as number[]).length
                        sp = (sprite as number[])[randint(0, length - 1)]
                    }  else {
                        sp = sprite
                    }  

                    if ((bitmask&rulemask) == rulemask) {
                        mset(x, y, sp)
                    }
                }
            }
        }
    }
}
function pico8_sin (x: number) {
    if (x >= 0 && x <= 0.5) {
        return 0 - Math.sin(2 * Math.PI * x)
    }
    return Math.sin(2 * Math.PI * x)
}

function pico8_cos(x: number) {
    if (x >= 0 && x <= 0.5) {
        return 0 - Math.cos(2 * Math.PI * x)
    }
    return Math.cos(2 * Math.PI * x)
}

function rectfill (x0: number, y0: number, x1: number, y1: number, col: number) {
    screen.fillRect(x0-scene.cameraLeft(), y0 - scene.cameraTop(), x1 - x0 + 1, y1 - y0 + 1, col)
}


function load_level (id: number) {
    stars = 0
    points = 0
    score = 1000
    prev_stars = dGetLevelStar(id)
    high_score = dGetLevelScore(id)
    level_id = id;
    level = levels[id]
    win_screen_y = -160
    win_screen_target_y = -160

    menu_id = 3

    tiles.loadMap(allMaps[id])
    clear_map_data()
    load_map_data()
    autotile(0, 0, level_width, level_height, myTileMap["w"], tilesets[0])

    ui_stars = []
    for (let i = 0 ; i < 3;i++) {
        ui_stars.push(new ui_star(4+i*16,4))
    }
}

function update_eye_position () {
    eye_pos += 1
    if (eye_pos > eye_frames.length - 1) {
        eye_pos = 0
    }
    set_timer(120, update_eye_position)
 }
 
function lerp (pos: number, tar: number, perc: number) {
    return (1 - perc) * tar + perc * pos
}
function initialize_eyes () {
    eye_pos = -1
    eye_speed = 0.85
}

let mapsData: Buffer;

function mset (c: number, r: number, snum: number) {
    mapsData.setUint8((c | 0) + (r | 0) * level_width, snum);
    if (snum == 1) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage81`)
    } else if (snum == 8) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage5`)
    } else if (snum == 9) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage6`)
    } else if (snum == 10) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage7`)
    } else if (snum == 11) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage8`)
    } else if (snum == 12) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage9`)
    } else if (snum == 13 || snum == 14) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage7`)
    } else if (snum == 24) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage20`)
    } else if (snum == 25) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage21`)
    } else if (snum == 26 || snum == 29 || snum == 30) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage22`)
    } else if (snum == 27) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage23`)
    } else if (snum == 28) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage24`)
    } else if (snum == 40) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage35`)
    } else if (snum == 41) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage36`)
    } else if (snum == 42 || snum == 44 || snum == 45 || snum == 46) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage37`)
    } else if (snum == 43) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage38`)
    } else if (snum == 56) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage99`)
    } else if (snum == 57) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage100`)
    } else if (snum == 58 || snum == 60 || snum == 61) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage102`)
    } else if (snum == 59) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage101`)
    } else if (snum == 62) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage82`)
    } else if (snum == 66) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage52`)
    } else if (snum == 85) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage70`)
    } else if (snum == 86) {
        tiles.setTileAt(tiles.getTileLocation(c, r), assets.image`myImage59`)
    } else if (snum == 89) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage71`)
    } else if (snum == 96) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage83`)
    } else if (snum == 97) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage84`)
    } else if (snum == 112) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage85`)
    } else if (snum == 113) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage86`)
    } else if (snum == 101) {
        tiles.setTileAt(tiles.getTileLocation(c, r), assets.image`myImage89`)
    } else if (snum == 102) {
        tiles.setTileAt(tiles.getTileLocation(c, r), assets.image`myImage90`)
    } else if (snum == 103) {
        tiles.setTileAt(tiles.getTileLocation(c, r), assets.image`myImage91`)
    } else if (snum == 117) {
        tiles.setTileAt(tiles.getTileLocation(c, r), assets.image`myImage92`)
    } else if (snum == 118) {
        tiles.setTileAt(tiles.getTileLocation(c, r), assets.image`myImage93`)
    } else if (snum == 119) {
        tiles.setTileAt(tiles.getTileLocation(c, r), assets.image`myImage94`)
    } else if (snum == 64) {
        tiles.setTileAt(tiles.getTileLocation(c, r), assets.image`myImage95`)
    } else if (snum == 80) {
        tiles.setTileAt(tiles.getTileLocation(c, r), assets.image`myImage97`)
    } else if (snum == 65) {
        tiles.setTileAt(tiles.getTileLocation(c, r), assets.image`myImage96`)
    } else if (snum == 81) {
        tiles.setTileAt(tiles.getTileLocation(c, r), assets.image`myImage98`)
    }
}

let randomWinCnt = randint(0,5);

function draw_bg_building (x: number, y: number) {
    rectfill(x, y, x + 12, 160, 3)
    rectfill(x+1 + 1, y + 2, x+1 + 3, y + 6, 6)
    rectfill(x+1 + 2, y + 3, x+1 + 2, y + 5, 7)

    // for(let wx = x + 1; wx < x + 7; wx+=6) {
    //     for(let wy = y; wy < y + 24; wy+=8) {
    //         //if ((randint(0,9)/10) > 0.8) {
    //             rectfill(wx + 1, wy + 2, wx + 3, wy + 6, 6)
    //             rectfill(wx + 2, wy + 3, wx + 2, wy + 5, 7)
    //         //}
            
    //     }
    // }
}
function draw_buildings () {
    offsets = [0,18,24,36,24,42,16,40,24,0,10,4,0]
    for(let i = 1; i < 14 ;i++) {
        let x = (i - 1) * 13
        let y = 48 + offsets[i-1]
        draw_bg_building(x, y)
    }
    // fg buildings
    rectfill(0, 70, 28, 76, 5)
    rectfill(0, 77, 26, 78, 15)
    rectfill(0, 79, 26, 128, 4)
    rectfill(98 + 32, 74, 128 + 32, 80, 5)
    rectfill(100 + 32, 81, 128 + 32, 82, 15)
    rectfill(100 + 32, 83, 128 + 32, 128, 4)
    screen.drawImage(assets.image`myImage76`, 4, 82)
    screen.drawImage(assets.image`myImage76`, 16, 82)
    screen.drawImage(assets.image`myImage76`, 4, 104)
    screen.drawImage(assets.image`myImage76`, 16, 104)
    screen.drawImage(assets.image`myImage76`, 104 + 32, 86)
    screen.drawImage(assets.image`myImage76`, 116+32, 86)
    screen.drawImage(assets.image`myImage76`, 116 + 32, 108)
    for (let w = 48; w <= 112; w+=2) {
        let x2 = 64 - (w / 2);
        let y2 = 84 + ((w - 48) / 2);
        rectfill(x2, y2-8, x2 + w + 32, y2-8, 5)
    }
    rectfill(8, 117-8, 152, 125-8, 12)
    rectfill(12, 126-8, 148, 128-8, 15)
}
let char3 = ""
let p = 0
let eye_pos:number = 0
let offsets: number[] = []
let level_width = 0
let count = ''
let data = ''
game.consoleOverlay.setVisible(true)
const colors = palette.defaultPalette();

const pico8_default_palette:number[] = [
    0x000000,
    0x1D2B53,
    0x7E2553,
    0x008751,
    0xAB5236,
    0x5F574F,
    0xC2C3C7,
    0xFFF1E8,
    0xFF004D,
    0xFFA300,
    0xFFEC27,
    0x00E436,
    0x29ADFF,
    0x83769C,
    0xFF77A8,
    0xFFCCAA
]  

function pal() {
    for (let i = 0; i < pico8_default_palette.length;i++) {
        let r = pico8_default_palette[i] >> 16;
        let g = pico8_default_palette[i] >> 8 & 0xff;
        let b = pico8_default_palette[i]  & 0xff;
        palette.setColor(i, color.rgb(r, g, b))
    }
}


//pico8 color 
//129 #111d35
//141 #754665
//136 #be1250
//130 #422136
//138 #A8E72E
//140 #065AB5
//137 #FF6C24
//143 #FF9D81


let levels = [`\
    wwwwwwwwwwwwwwwwwwww
    w......l...l.......w
    w..h.........#.....w
    w.p...s.ms..s...c..w
  `,`\
    wwwwwwwwwwwwwwww
    wwwww.l......www
    wwwww....#...www
    wwwwwh....c..www
    wwwwws..wwwwwwww
    wwwww...wwwwwwww
    wwwww..swwwwwwww
    wwwww...wwwwwwww
    wwwwws..wwwwwwww
    wwwww........www
    wwwww........www
    wwwww..m...p.www
    wwwwwwwwwwwwwwww
  `,`\
    wwwwwwwwwwwwwwwwwwwwwww
    ww.....l.......l.....ww
    ww.........h....#.h..ww
    wwmp.s.....s.....s.c.ww
    wwwwww...wwwww...wwwwww
    wwwwww...wwwww...wwwwww
    wwwwww<^>wwwww<^>wwwwww
  `,`\
    ww.l.......l.........wwww
    ww.....h.............wwww
    ww.............t...p.wwww
    ww...wwwwwwwwwwwwwwwwwwww
    ww...wwwwwwwwwwwwwwwwwwww
    ww...wwwwwwwwwwwwwwwwwwww
    ww.......l.....l.....l.ww
    ww.h.............h.....ww
    ww....s.....s.....s....ww
    ww...www...www...www...ww
    ww...www...www...www.#.ww
    ww<^>www<^>www<^>www.c.ww
  `,`\
    ww.......l.....l...#..www
    ww....h..........h....www
    ww.................c..www
    ww...www...www...wwwwwwww
    ww...www...www..swwwwwwww
    ww...www..swww...wwwwwwww
    ww...www...www...wwwwwwww
    ww...www<^>www...wwwwwwww
    ww...wwwwwwwwws..wwwwwwww
    ww...wwwwwwwww...wwwwwwww
    ww.p.wwwwwwwww<^>wwwwwwww
  `,`\
    ww.....l.....l.....l....www
    ww...................#..www
    ww..h......s.....h....c.www
    ww.......wwwww.......wwwwww
    ww...s...wwwww...s...wwwwww
    ww..===..wwwww..===..wwwwww
    ww.......wwwww.......wwwwww
    ww.t.p...wwwww..mz...wwwwww
  `,`\
    ww........wwwwwwwwwwwwwwwww
    ww........wwwwwwwwwwwwwwwww
    ww...c....wwwwwwwwwwwwwwwww
    ww..====..wwwwwwwwwwwwwwwww
    ww..........l.....l......ww
    ww#......................ww
    ww..........z..s..z......ww
    wwwwwwwwwwwwwwwwwwwwww...ww
    wwwwwwwwwwwwwwwwwwwwww...ww
    wwwwwwwwwwwwwwwwwwwwwws..ww
    ww..........l.....l......ww
    ww.............#.........ww
    ww.tp.......z..s..z......ww
  `,`\
    ww....l.....l......l...ww
    ww.............#.....s.ww
    wwc....................ww
    wwwwwwww...www...wwwwwwww
    wwwwwwww...www...wwwwwwww
    wwwwwwww...www...wwwwwwww
    ww...www...www...wwwwwwww
    wwhs.www...www...wwwwwwww
    ww...www...www...wwwwwwww
    ww.........www.........ww
    ww...h.....www.......s.ww
    ww.t.....<^www^>..p.m..ww
  `,`\
    wwwwwwwwwwwwwwwww...w
    wwwwwwwwwwwwwwwww.c.w
    wwwwwwwwwwwwwwwww===w
    wwwwwwwwwwwwwwwww...w
    wwwwwwwwwwwwwwwww...w
    wwwww....l.........sw
    wwwww...............w
    wwwww...........zm..w
    wwwww...www...wwwwwww
    wwwww.h.www...wwwwwww
    wwwwws..www...wwwwwww
    ww.v....www...wwwwwww
    ww/.....www..swwwwwww
    ww..p...www...wwwwwww
  `,`\
    ww......l.....wwwwwww...ww
    ww........h...wwwwwww.c.ww
    ww.s..m.....p.wwwwwww=+=ww
    ww..\\wwwwwwwwwwwwwwww.l.ww
    ww...wwwwwwwwwwwwwwww...ww
    ww..\\wwwwwwwwwwwwwwwws..ww
    ww.........l............ww
    ww.h...........#........ww
    ww......................ww
    ww......wwwwww...s...wwwww
    ww.====.wwwwww..===..wwwww
    ww<^^^^>wwwwww<^^^^^>wwwww
  `
  ]

const myTileMap: { [key: string]: any } = {
    ".": function (x: number, y: number) {

    },
    "w": 1,
    "=": 85,
    "+": 89,
    "t": 66,
    "l": 86,
    "p": function(x:number,y:number) {
        (currentScene as gameScene).mplayer = new player(x * 8, y * 8);
    },
    "c": function (x: number, y: number) {
        new cat(x * 8, y * 8)
    },
    "s": function (x: number, y: number) {
        new star(x * 8, y * 8)
    },
    "^": function (x: number, y: number) {
        new spike(x * 8, y * 8)
    },
    "<": function (x: number, y: number) {
        new spike(x * 8, y * 8,82)
    },
    ">": function (x: number, y: number) {
        new spike(x * 8, y * 8, 84)
    },
    "z": function (x: number, y: number) {
        new saw(x * 8, y * 8)
    },
    "/": function (x: number, y: number) {
        new saw(x * 8, y * 8, 'right')
    },
    "\\": function (x: number, y: number) {
        new saw(x * 8, y * 8, 'left')
    },
    "v": function (x: number, y: number) {
        new saw(x * 8, y * 8, 'down')
    },
    "#": function (x: number, y: number) {
        let sp1 = [64,80]
        let sp2 = [65,81]
        mset(x, y, sp1[randint(0,1)])
        mset(x + 1, y, sp2[randint(0, 1)])
    },
    "m": function (x: number, y: number) {
        mset(x, y - 1, 101)
        mset(x + 1, y - 1, 102)
        mset(x + 2, y - 1, 103)
        mset(x, y, 117)
        mset(x + 1, y, 118)
        mset(x + 2, y, 119)
    },
    "h": function (x: number, y: number) {
        mset(x,y,96)
        mset(x+1, y, 97)
        mset(x, y + 1, 112)
        mset(x + 1, y + 1, 113)
    },
};

const tilesets: any[][][]= [
    [
        [0b00000000,8],
        [0b01000000,56],
        [0b00010000,59],
        [0b00001000, 57],
        [0b00000010, 24],
        [0b01010000, 43],
        [0b01001000, 41],
        [0b01000010, 40],
        [0b00011000, [58, 60, 61, 62]],
        [0b00010010, 11],
        [0b00001010, 9],
        [0b01011000, [42, 42, 42, 42, 42, 42, 42, 44, 45, 46]],
        [0b01010010, 27],
        [0b01001010, 25],
        [0b00011010, [10, 12, 13, 14]],
        [0b01011010, [26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 29, 28, 30]],

    ]
];

scene.setBackgroundColor(1)
let level:string;
let level_height:number;
let mytras:transition;
timers = []
mytras = new transition()
let allMaps: tiles.WorldMap[] = []

allMaps = [
    tiles.createSmallMap(tilemap`level2`),
    tiles.createSmallMap(tilemap`level3`),
    tiles.createSmallMap(tilemap`level4`),
    tiles.createSmallMap(tilemap`level5`),
    tiles.createSmallMap(tilemap`level6`),
    tiles.createSmallMap(tilemap`level7`),
    tiles.createSmallMap(tilemap`level8`),
    tiles.createSmallMap(tilemap`level9`),
    tiles.createSmallMap(tilemap`level10`),
    tiles.createSmallMap(tilemap`level11`),
];

let currentScene: customScene;
function load_scene(new_scene: customScene) {
    if (currentScene != new_scene) {
        timers = []
        currentScene = new_scene
        currentScene.init()
    }
}

function load_cart_data() {
    max_level_id = middleOfThree(0, dGetMaxLevel(),levels.length-1)
    level_id = max_level_id
}

function draw_score_ui() {
    if (max_level_id >= levels.length-1) {
        let total_stars = 0
        let total_score = 0

        for (let i = 0; i < levels.length;i++) {
            let dstar = dGetLevelStar(i);
            let dscore = dGetLevelScore(i);
            total_stars += dstar;
            total_score += dscore;
        }

        let score_string = total_score.toString()
        let allStarNum = levels.length * 3
        mapPrint("stars: ", 11, 119-8, 7)
        mapPrint(total_stars + "/" + allStarNum, 46, 119 - 8, 6)
        mapPrint(score_string, 119+24 - score_string.length * 4, 119 - 8, 6)
        mapPrint("score: ", 119 + 16 - (score_string.length + "score: ".length) * 4, 119 - 8, 7)
    }
}

load_cart_data()
let titlescene = new title()
load_scene(titlescene)
// controller.B.onEvent(ControllerButtonEvent.Pressed, function() {
//     blockSettings.clear()
// })
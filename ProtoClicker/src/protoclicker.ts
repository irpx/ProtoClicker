class GameInit extends Phaser.State
{
    create()
    {
        this.game.stage.backgroundColor = '#4d4d4d';

        if (this.game.device.desktop)
        {
            this.game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
            this.game.scale.pageAlignVertically = true;
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.refresh();
        }
        else
        {
            this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        }

        this.game.state.start(GameStates.START_GAME, true);
    }
}

class LoadingScreen extends Phaser.State
{
    title: string;
    imagesToLoad: Array<[string, string]>

    constructor(title: string, loadImages:Array<[string,string]>)
    {
        super();

        this.title = title;
        this.imagesToLoad = loadImages;
    }

    preload()
    {
        this.game.add.text(80, 150, this.title, { font: "30px Verdana", fill: "#ffffff" });

        for (let image of this.imagesToLoad)
        {
            console.log("Loading :" + image[0] + ":" + image[1]);
            this.game.load.image(image[0], image[1]);
        }
    }

    create()
    {
        this.game.state.start(GameStates.START_GAME, true);
    }
}

class StartMenu extends Phaser.State
{
    text: Phaser.Text;

    create()
    {
        let startButton: Phaser.Key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        startButton.onDown.addOnce(this.startGame, this);

        this.text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Press Space to start", { font: "30px Verdana", fill: "#ffffff" });
        this.text.anchor.setTo(0.5, 0.5);
    }

    update()
    {
        this.text.rotation+=0.01;
    }

    startGame()
    {
        this.game.state.start(GameStates.PLAY_GAME, true);
    }
}

class GameDebug extends Phaser.State
{
    player: Phaser.Sprite;
    platforms: Phaser.Group;
    cursors: Phaser.CursorKeys;
    jumpButton: Phaser.Key;
    exitButton: Phaser.Key;

    create()
    {
        this.game.stage.backgroundColor = '#4d4d4d';

        this.player = this.game.add.sprite(100, 200, 'player');
        this.player.anchor.setTo(0.5, 0.5);

        this.game.physics.arcade.enable(this.player);

        this.player.body.collideWorldBounds = true;
        this.player.body.gravity.y = 500;

        this.platforms = this.game.add.physicsGroup();

        let w: number = 2000;
        let h: number = 1000;
        let platforms: number = 50;
        for (let i: number = 0; i < platforms; ++i)
        {
            this.platforms.create(Math.random() * w, Math.random() * h, 'platform');
        }

        this.platforms.setAll('body.immovable', true);

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.exitButton = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);

        this.game.world.setBounds(0, 0, w, h);
        this.game.camera.follow(this.player);//, 1, 0.1, 0.1);

        this.game.input.onDown.add(this.onClick,this);
    }

    update()
    {
        this.game.physics.arcade.collide(this.player, this.platforms);

        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown)
        {
            this.player.body.velocity.x = -250;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.velocity.x = 250;
        }

        if (this.jumpButton.isDown && (this.player.body.onFloor() || this.player.body.touching.down))
        {
            this.player.body.velocity.y = -400;
        }

        if (this.exitButton.isDown)
        {
            this.game.state.start(GameStates.START_GAME, true);
        }
    }

    render()
    {
        var game: Phaser.Game = this.game;

        game.debug.text("Proto Clicker Arrows:Keys\nSpace:Jump\nEsc:Exit\nMouse Click:Move Player", 0, 20);

        game.debug.inputInfo(400, 32);
        game.debug.pointer(game.input.activePointer);
    }

    onClick()
    {
        this.player.position.x = this.game.input.activePointer.x + this.game.camera.position.x;
        this.player.position.y = this.game.input.activePointer.y + this.game.camera.position.y;
    }
}

class ProtoClicker
{
    game: Phaser.Game;
    
    constructor(width: number, height: number, container: string)
    {
        this.game = new Phaser.Game(width, height, Phaser.AUTO, container);

        let assets:Array<[string, string]> = [
            ["player", "res/move.png"],
            ["platform", "res/alert.png"]
        ];

        this.game.state.add(GameStates.INIT_GAME, new GameInit());
        this.game.state.add(GameStates.PRELOAD_GAME, new LoadingScreen("Loading...", assets));
        this.game.state.add(GameStates.START_GAME, new StartMenu());
        this.game.state.add(GameStates.PLAY_GAME, new GameDebug());

        this.game.state.start(GameStates.PRELOAD_GAME, true);
    }
    
    onResize(width: number, height: number)
    {
        this.game.stage.width = width;
        this.game.stage.height = height;
        this.game.scale.refresh();
    }

    toggleFullscreen()
    {
        if (this.game.scale.isFullScreen)
        {
            this.game.scale.stopFullScreen();
        }
        else
        {
            this.game.scale.startFullScreen(false);
        }
    }
}

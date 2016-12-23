class ProtoClicker {

    game: Phaser.Game;

    constructor() {
       this.game = new Phaser.Game(700, 700, Phaser.AUTO, "content", {
           preload: this.preload,
           create: this.create,
           update: this.update,
           render: this.render
        });
    }

    preload() {
        this.game.load.image("logo", "res/alert.png");
    }

    create() {
        var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);
        this.game.input.onDown.add((e) => {
            logo.position.x = e.clientX;
            logo.position.y = e.clientY;
        });
        /*
        this.game.input.keyboard.addCallbacks(

        );*/
    }

    update() {

    }

    render() {

    }
}

window.onload = () => {
    var p: ProtoClicker = new ProtoClicker();
};
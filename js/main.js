kaboom({
    background: [84, 192, 201], // The RGB code
});

loadSprite('birdy', 'assets/images/birdy.png');
loadSprite('bg', 'assets/images/bg.png');
loadSprite('pipe', 'assets/images/pipe.png');
loadSound('wooosh', 'assets/sounds/wooosh.mp3');

scene('game', () => {
    // todo.. add scene code here
    add([sprite('bg', { width: width(), height: height() })]);

    const player = add([
        // list of components
        sprite('birdy'),
        scale(2),
        pos(80, 40),
        area(),
        body(),
    ]);

    onKeyPress('space', () => {
        play('wooosh');
        player.jump(400);
    });

    const PIPE_GAP = 120;

    function producePipes() {
        const offset = rand(-50, 50);

        add([sprite('pipe'), pos(width(), height() / 2 + offset + PIPE_GAP / 2), 'pipe', area(), { passed: false }]);

        add([sprite('pipe', { flipY: true }), pos(width(), height() / 2 + offset - PIPE_GAP / 2), origin('botleft'), 'pipe', area()]);
    }

    onUpdate('pipe', (pipe) => {
        pipe.move(-160, 0);

        if (pipe.passed === false && pipe.pos.x < player.pos.x) {
            pipe.passed = true;
            score += 1;
            scoreText.text = score;
        }
    });

    loop(1.5, () => {
        producePipes();
    });

    let score = 0;
    const scoreText = add([text(score, { size: 50 }), pos(20, 15)]);

    player.collides('pipe', () => {
        go('gameover', score);
    });

    player.onUpdate(() => {
        if (player.pos.y > height() + 30 || player.pos.y < -30) {
            go('gameover', score);
        }
    });
});

let highScore = 0;
scene('gameover', (score) => {
    // todo.. add scene code here
    if (score > highScore) {
        highScore = score;
    }

    add([text('Game Over!\n\n' + 'Score: ' + score + '\nHigh Score: ' + highScore + '\n\nPress Space to Continue!', { size: 45 }), pos(center()), origin('center')]);

    onKeyPress('space', () => {
        go('game');
    });
});

go('game');

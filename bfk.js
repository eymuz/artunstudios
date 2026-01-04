const BFK = (() => {

    let scene, camera;
    let birds = [];
    let poops = [];
    let poopSound;
    let flashPlane;
    const Y_OFFSET_BELOW_CAMERA = -0.05;
    const Y_FOLLOW_FORCE = 0.05;       // yumuşak Y düzeltme
    const MIN_CAMERA_DIST = 4.0;   // bu mesafeden DAHA YAKINSA KAÇ
    const MAX_CAMERA_DIST = 14.0;  // bu mesafeden DAHA UZAKSA GERİ DÖN
    const CAMERA_FORCE = 0.04;     // yumuşak itme
    const SEPARATION_FORCE = 0.05;   // kaçış gücü
    const SEPARATION_DIST  = 1.2;    // bu mesafeden yakınsa kaçar
    const SEPARATION_CHANCE = 0.1;  // frame başına dağılma ihtimali
    let zortAudio = null;
    const BIRD_COUNT_PER_TYPE = 10;
    const MAX_HEIGHT = 6;
    const MIN_HEIGHT = 3;
    const MAX_PLAYER_DIST = 15;
    const MAX_BIRD_SPREAD = 2;
    const SPEED = 0.3;
    let lastClampTime = 0;
    const CLAMP_INTERVAL = 500; // ms – arttırırsan daha sakin olur

    function createFlash() {
        flashPlane = BABYLON.MeshBuilder.CreatePlane("flash", { size: 10 }, scene);
        flashPlane.position.z = 0.1;
        flashPlane.parent = camera;
        const mat = new BABYLON.StandardMaterial("flashMat", scene);
        mat.diffuseColor = new BABYLON.Color3(1, 0, 0);
        mat.alpha = 0;
        flashPlane.material = mat;
    }

    function flashRed() {
        flashPlane.material.alpha = 0.4;
        setTimeout(() => {
            flashPlane.material.alpha = 0;
        }, 120);
    }

    function createBird(texturePath) {
        const bird = BABYLON.MeshBuilder.CreatePlane("bird", { width: 1, height: 1 }, scene);
        const mat = new BABYLON.StandardMaterial("birdMat", scene);
        mat.diffuseTexture = new BABYLON.Texture(texturePath, scene);
        mat.backFaceCulling = false;
        bird.material = mat;
bird.lastPoopTime = 0;
        bird.position = camera.position.add(new BABYLON.Vector3(
            Math.random() * 6 - 3,
            Math.random() * 2 + 3,
            Math.random() * 6 - 3
        ));

        bird.velocity = new BABYLON.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize().scale(SPEED * (1 + Math.random()));

        return bird;
    }

    function dropPoop(bird) {
        const poop = BABYLON.MeshBuilder.CreatePlane("poop", { size: 0.3 }, scene);
        const mat = new BABYLON.StandardMaterial("poopMat", scene);
        mat.diffuseTexture = new BABYLON.Texture("kaka.png", scene);
        mat.backFaceCulling = false;
        poop.material = mat;

        poop.position = bird.position.clone();
        poop.velocity = new BABYLON.Vector3(0, -0.15, 0);
        poops.push(poop);

        playZort();
    }

    function updateBird(bird) {
        const now = performance.now();

if (now - bird.lastPoopTime > 2000) {   // ⏱️ 2 saniye bekleme
    if (Math.random() < 0.002) {
        dropPoop(bird);
        bird.lastPoopTime = now;
    }
}

        // 💣 Kaka atma (kuş başına, clamp'ten bağımsız)
if (Math.random() < 0.002) {   // ihtimal
    dropPoop(bird);
}

        // 🔒 Kamera Y seviyesini kilitle
const targetY = camera.position.y - Y_OFFSET_BELOW_CAMERA;
const yDiff = targetY - bird.position.y;

// Yavaşça hedef Y’ye çek
bird.velocity.y += yDiff * Y_FOLLOW_FORCE;

// Sert sınır: asla kameranın üstüne çıkmasın
if (bird.position.y > targetY) {
    bird.position.y = targetY;
    if (bird.velocity.y > 0) bird.velocity.y = 0;
}

        bird.position.addInPlace(bird.velocity);
        const toCam = bird.position.subtract(camera.position);
        const dist = toCam.length();

        if (dist < MIN_CAMERA_DIST) {
            bird.velocity.addInPlace(
                toCam.normalize().scale(CAMERA_FORCE)
            );
        }
        else if (dist > MAX_CAMERA_DIST) {
            bird.velocity.addInPlace(
               toCam.normalize().scale(-CAMERA_FORCE * 0.6)
            );
        }

        // Yükseklik sınırı
        if (bird.position.y > MAX_HEIGHT || bird.position.y < MIN_HEIGHT) {
            bird.velocity.y *= -1;
        }

        // Oyuncudan uzaklaşmasın
        const toPlayer = bird.position.subtract(camera.position);
        if (toPlayer.length() > MAX_PLAYER_DIST) {
            bird.velocity = toPlayer.normalize().scale(-SPEED);
        }

        // Sekme
        if (Math.random() < 0.02) {
            bird.velocity.x += (Math.random() - 0.5) * 0.1;
            bird.velocity.z += (Math.random() - 0.5) * 0.1;
        }

        // Kaka atma (%50)
        if (Math.random() < 0.002) {
            if (Math.random() < 0.5) dropPoop(bird);
        }
    }

    function updatePoops() {
        poops.forEach((poop, i) => {
            poop.position.addInPlace(poop.velocity);

            const dist = BABYLON.Vector3.Distance(poop.position, camera.position);
            if (dist < 0.5) flashRed();

            if (poop.position.y < 0) {
                poop.dispose();
                poops.splice(i, 1);
            }
        });
    }

    function clampBirds() {
    
}
function playZort() {
    if (!zortAudio) return;

    // aynı anda üst üste çalabilsin diye clone
    const s = zortAudio.cloneNode();
    s.volume = 1.0;
    s.play().catch(() => {});
}


    function init(_scene, _camera) {
        scene = _scene;
        camera = _camera;

        zortAudio = new Audio("zort.mp3");
        zortAudio.preload = "auto";
        zortAudio.volume = 1.0;

        createFlash();

        ["blue.png", "green.png", "alex.png"].forEach(tex => {
            for (let i = 0; i < BIRD_COUNT_PER_TYPE; i++) {
                birds.push(createBird(tex));
            }
        });

        scene.onBeforeRenderObservable.add(() => {
            birds.forEach(updateBird);
            clampBirds();
            updatePoops();
            const now = performance.now();
            if (now - lastClampTime > CLAMP_INTERVAL) {
                clampBirds();
                lastClampTime = now;
       }

        });
    }

    return { init };
})();

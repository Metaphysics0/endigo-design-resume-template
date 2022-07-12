import * as PIXI from 'pixi.js';
import { tile } from '$lib/stores';
import { GameObject } from './GameObject';
import { presetPaths } from '$lib/data/preset-paths';
import { cameraStore } from '$lib/stores';
import { dialogStore } from '$lib/stores';

export class Npc extends GameObject {

    public portrait: string;

    // Dialog
    public dialog: string;
    private dialogVisible: boolean = true;

    // Pathing
    private path: any;
    private pathProgress: number = tile.unit(1);
    private pathIndex: number = 0;
    private isWaiting: boolean = false;
    private currentScaleX: boolean = false;

    constructor(config: any) {
        // Hardcoded
        config.animatedSpriteSettings = { animationSpeed: 0.15, width: 2, height: 3, ...config.animatedSpriteSettings };
        config.containerSettings = { width: 2, height: 3, ...config.containerSettings };
        super(config);
        // NPC Settings
        this.path = presetPaths[config.path] || presetPaths['idle'];
        this.portrait = config.portrait || 'portrait.png';
        this.dialog = config.dialog || 'DefaultDialogText';
        // Init
        this.onInit();
    }

    onInit(): void {
        // Handle Interaction
        this.container.interactive = true;
        this.container.on('pointerover', (e: any) => { this.onPointerOver(); });
        this.container.on('pointerdown', (e: any) => { this.onPointerDown(); });
        this.container.on('pointerout', (e: any) => { this.onPointerOut(); });
        // Handle Dialog open state
        dialogStore.subscribe((d: any) => {
            this.dialogVisible = d === undefined;
            this.animatedSprite.gotoAndStop(0);
        });
        // Draw shadow with graphic
        this.addShadow();
    }

    // Handle Pathing Movement ---

    movement(): void {
        if (!this.dialogVisible) return;
        if (this.isWaiting) return;
        // Run Current Path
        if (this.pathProgress >= 0) {
            // Animate
            if (this.animatedSprite.playing === false) { this.animatedSprite.play(); } 
            // Pathing
            const currentPath: any = this.path[this.pathIndex];
            switch(currentPath.path) {
                case 'up': this.container.y -= 1; break;
                case 'left': this.container.x -= 1; this.toggleFlip(true); break;
                case 'down': this.container.y += 1; break;
                case 'right': this.container.x += 1; this.toggleFlip(false); break;
                case 'wait':
                    this.isWaiting = true;
                    this.animatedSprite.gotoAndStop(0);
                    setTimeout(() => {
                        this.isWaiting = false;
                        this.triggerNextPath();
                    }, currentPath.delay);
                    break;
            }
            this.pathProgress -= 1;
        }
        // Switch to Next Path
        if (this.pathProgress <= 0) { this.triggerNextPath(); }
    }

    triggerNextPath(): void {
        this.pathProgress = tile.unit(1);
        (this.pathIndex+1) >= this.path.length ? this.pathIndex = 0 :  this.pathIndex++;
    }

    toggleFlip(newValue: boolean): void {
        if (this.currentScaleX !== newValue) {
            this.currentScaleX = newValue;
            if (this.currentScaleX === true) {
                // Flip Left
                this.container.scale.x *= -1
                this.container.x += tile.unit(2);
            } else {
                // Flip Right
                this.container.scale.x = 1;
                this.container.x -= tile.unit(2);
            }
        }
    }

    // Handle Input ---

    onPointerOver(): void {
        let filterEffect: any = new PIXI.filters.ColorMatrixFilter();
            filterEffect.brightness(1.3, false);
        this.container.filters = [filterEffect];
    }

    onPointerDown(): void {
        cameraStore.set({target: this, animate: true});
        // Remove existing dialog and replace with this dialog
        dialogStore.set(undefined);
        dialogStore.set({
            name: this.name,
            message: this.dialog,
            portrait: this.portrait
        });
    }
    
    onPointerOut(): void {
        this.container.filters = [];
    }

    // Draw Shadow ---

    addShadow(): void {
        const graphicShadow = new PIXI.Graphics();
            graphicShadow.beginFill(0x000000, 0.2);
            graphicShadow.drawEllipse(tile.unit(1), tile.unit(2.5), tile.unit(0.5), tile.unit(0.25));
            graphicShadow.endFill();
            graphicShadow.filters = [new PIXI.filters.BlurFilter(5)];
        this.container.addChild(graphicShadow);
    }

    // Render ---

    render(): void {
        this.movement();
    }

}
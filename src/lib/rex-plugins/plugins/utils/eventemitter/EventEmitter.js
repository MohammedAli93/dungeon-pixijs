import Phaser from 'phaser';

class EventEmitter extends Phaser.Events.EventEmitter {
    shutdown() {
        this.removeAllListeners();
    }
    destroy() {
        this.removeAllListeners();
    }
}
export default EventEmitter;
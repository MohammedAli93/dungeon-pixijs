import "phaser";
import RexUIPlugin from "./lib/rex-plugins/templates/ui/ui-plugin";

declare module "phaser" {
  interface Scene {
    rexUI: RexUIPlugin;
  }
}

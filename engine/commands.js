/*
 * NULL Engine
 *
 * @module  core/commands
 * @author  kod.connect & PROPHESSOR
 */
ND.Commands = new class Commands {
    give (item, silent = false) {
        let o = null;

        if (item === 'all') {
            // give all weapons
            for (const i in ND.Player.defweapons) {
                if (i !== 'default') {
                    this.give(i, true);
                }
            }
            if (!silent) {
                ND.UI.drawMessage(ND.UI.msg.STSTND.RendererKFAADDED);
            }
        } else if (item !== 'default') {
            if (typeof ND.Player.defweapons[item] !== 'undefined') {
                o = ND.Player.defweapons[item];

                ND.Player.weapons[item] = true; // give weapon itself
                const ammo_max = ND.Player.defammo[ND.Player.defweapons[item].ammo].capacity;
                const ammo_has = ND.Player.ammo[ND.Player.defweapons[item].ammo] || 0;

                if (ammo_has < ammo_max) {
                    if (ammo_has + o.contains <= ammo_max) {
                        ND.Player.ammo[ND.Player.defweapons[item].ammo] = ammo_has + o.contains;
                    } else {
                        ND.Player.ammo[ND.Player.defweapons[item].ammo] = ammo_max;
                    }
                }
            } else if (typeof ND.Player.defammo[item] !== 'undefined') {
                o = ND.Player.defammo[item];
                const ammo_max = ND.Player.defammo[o.ammotype].capacity;
                const ammo_has = ND.Player.ammo[o.ammotype] || 0;

                if (ammo_has < ammo_max) {
                    if (ammo_has + o.capacity <= ammo_max) {
                        ND.Player.ammo[ND.Player.defammo[item].ammotype] = ammo_has + o.capacity;
                    } else {
                        ND.Player.ammo[ND.Player.defammo[item].ammotype] = ammo_max;
                    }
                    o.onPickup = ND.Player.defammo.onPickup;
                }
            } else if (typeof ND.Player.defpowerups[item] !== 'undefined') {
                o = ND.Player.defpowerups[item];

            } else {
                // FIXME: wtf ?
                o = {
                    onPickup () {
                        return ND.UI.msg.GOTUNKNWN.replace('%item%', item);
                    }
                };
            }
            const message = typeof o.onPickup === 'function' ? o.onPickup(item) : `ERROR: No pickup for ${item}`;

            if (!silent) {
                ND.UI.drawMessage(message);
            }
        }
    }

    giveThing (item) {
        if (item.weapon) {
            this.give(item.weapon);
        } else if (item.ammo) {
            this.give(item.ammo);
        } else if (item.powerup) {
            this.give(item.powerup);
        } else {
            this.give(item);
        }
    }

    nextmap () {
        console.log('nextmap()');
        ND.Map.next(); // TODO:
    }

    // disable wall collisions
    noclip () {
        ND.UI.drawMessage(ND.Config.noclip ? ND.UI.msg.STSTND.RendererNCOFF : ND.UI.msg.STSTND.RendererNCON);
        ND.Config.noclip = !ND.Config.noclip;
    }

    opendoor (sector, special) {
        console.log('opendoor(', sector, ')');
        const backlines = [];
        const frontlines = [];
        const walls = [];
        let ceiling = [];
        const sectors = [];
        let height = 666;

        special = typeof special === 'undefined' ? 1 : special;
        // collect lines
        for (const i in ND.Map.sidedef) {
            const tside = ND.Map.sidedef[i];

            if (tside.sector === sector) {
                // get lines
                for (const j in ND.Map.linedef) {
                    const tline = ND.Map.linedef[j];

                    if (tline.sideback === i) {
                        const heightceiling = ND.Map.sector[ND.Map.sidedef[tline.sidefront].sector].heightceiling;
                        // choose lowest

                        height = height > heightceiling ? heightceiling : height;
                        backlines.push(j);
                    } else if (tline.sidefront === i) {
                        frontlines.push(j);
                    }
                }
            }
        }
        // find walls
        //
        for (const i in ND.Renderer.walls) {
            for (const j in backlines) {
                if (ND.Renderer.walls[i].linedef === backlines[j]) {
                    walls.push(i);
                } else if (ND.Renderer.walls[i].linedef === frontlines[j]) {
                    //resize frontwalls to fill gaps
                    ND.Renderer.walls[i].scale.y = height + 2;
                    ND.Renderer.walls[i].position.y += height / 2;
                }
            }
        }
        // find ceiling
        //
        for (const i in ND.Renderer.ceilings) {
            if (ND.Renderer.ceilings[i].sector === sector) {
                ceiling = i;
            }
        }
        ND.Map.actions.push({
            special,
            sector,
            ceiling,
            walls,
            height
        });
    }

    opendoorTag (tag, special) {
        const sectors = [];

        for (const s in ND.Map.sector) {
            const sector = ND.Map.sector[s];

            if (sector.id === tag) {
                sectors.push(s);
            }
            if (s === ND.Map.sector.length - 1) {
                for (const s in sectors) {
                    this.opendoor(sectors[s], special);
                }
            }
        }
    }

    prevweapon () {
        //for ()
    }

    slot1 () {
        ND.Player.switchWeaponSlot(1);
    }

    slot2 () {
        ND.Player.switchWeaponSlot(2);
    }

    slot3 () {
        ND.Player.switchWeaponSlot(3);
    }

    slot4 () {
        ND.Player.switchWeaponSlot(4);
    }

    slot5 () {
        ND.Player.switchWeaponSlot(5);
    }

    slot6 () {
        ND.Player.switchWeaponSlot(6);
    }

    slot7 () {
        ND.Player.switchWeaponSlot(7);
    }

    slot8 () {
        ND.Player.switchWeaponSlot(8);
    }

    slot9 () {
        ND.Player.switchWeaponSlot(9);
    }

    slot0 () {
        ND.Player.switchWeaponSlot(0);
    }

    // Random generator: from, to
    random (min, max) {
        return Math.floor(Math.random() * max + min);
    }

    zoomin () {
        ND.Renderer.mode.next();
    }

    zoomout () {
        ND.Renderer.mode.prev();
    }


    init (o) {
    }

    postInit (o) {
    }

}();

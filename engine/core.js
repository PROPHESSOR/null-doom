/**
 * NULL Engine
 *
 * @module core
 * @author kod.connect & PROPHESSOR
 *
 */

ND.Core = new class Core {
    constructor () {
        this.tmod = 0; // current loading mod at loading stage

        this.modules = ['tools', 'commands', 'gameplay', 'input', 'objects', 'player', 'interface', 'render', 'sound', 'wad'
        ];

        {
            this.constants = this.constants.bind(this);
            this.include = this.include.bind(this);
            this.init = this.init.bind(this);
            this.loadNext = this.loadNext.bind(this);
        }
    }

    init () {
        console.log('....ND.Core.init()');

        this.loadNext();
    }

    /** Задаёт константы
     * @param  {object} constants - key: value
     */
    constants (constants) {
        Object.assign(ND.Const, constants);
    }

    /** Подключает внешний js файл
     * @param  {string} f - путь
     * @param  {function} callback - cb
     */
    include (f, callback) {
        $.getScript(f)
            .done((/* script, textStatus */) => {

                if (typeof callback === 'function') {
                    callback();
                }
            })
            .fail((jqxhr, settings, exception) => {
                console.log(jqxhr, exception);
            });
    }


    loadNext () {
        const m = this.modules[this.tmod++];

        if (m) {
            ND[m] = {};
            console.log(`..loading engine/${this.modules[m]}.js`);
            this.include(`engine/${this.modules[m]}.js`, this.loadNext);
        }
    }
}();

;(function (window) {
    Dialogx = function (opt) {
        var that = this;
        that.options = {
            'id': opt.id || '',
            'container': opt.container || [],
            //回调函数
            'onContainerInit': opt.onContainerInit || null,
            'onBeforeDialogOpen': opt.onBeforeDialogOpen || null,
            'onAfterDialogOpen': opt.onAfterDialogOpen || null,
            'onBeforeDialogClose': opt.onBeforeDialogClose || null,
            'onAfterDialogClose': opt.onAfterDialogClose || null,
            'onBeforeDialogDestroy': opt.onBeforeDialogDestroy || null,
            'onAfterDialogDestroy' : opt.onAfterDialogDestroy || null
        }
        if (!that.options.id || that.options.id.length < 0) {
            return false;
        } else {
            that._init();
        }
    }
    Dialogx.prototype = {
        '_init': function () {
            var that = this;
            //生成div
            that.genDialogContainer();
            that.addHiddenEvent();
        },
        'genDialogContainer': function () {
            var that = this;
            if (document.getElementById(that.options.id)) {
                return;
            }
            var _htmlArr = ['<div class="dialog__overlay"></div>', '<div class="dialog__content" id="content_' + that.options.id + '">', '<div class="dialog__container"></div>', '</div>'];
            var dialogDom = document.createElement('div');
            dialogDom.setAttribute('id', that.options.id);
            dialogDom.innerHTML = _htmlArr.join('');
            dialogDom.className = 'dialog dialog--close';
            document.body.appendChild(dialogDom);
            if (that.options.container.length > 0) {
                var container = getChildNodeByClass('content_' + that.options.id, 'dialog__container');
                container.innerHTML = that.options.container.join('');
            }
            if (that.options.onContainerInit) {
                that.options.onContainerInit.call(that)
            }
        },
        'addHiddenEvent': function () {
            var that = this;
            var overlayDom = getChildNodeByClass(that.options.id, 'dialog__overlay');
            overlayDom.addEventListener('click', function () {
                that.hide();
            });
        },
        'show': function () {
            var that = this;
            if (that.options.onBeforeDialogOpen) {
                that.options.onBeforeDialogOpen.call(that)
            }
            removeClass(that.options.id, 'dialog--close');
            addClass(that.options.id, 'dialog--open');
            if (that.options.onAfterDialogOpen) {
                that.options.onAfterDialogOpen.call(that)
            }
        },
        'hide': function () {
            var that = this;
            if (that.options.onBeforeDialogClose) {
                that.options.onBeforeDialogClose.call(that)
            }
            removeClass(that.options.id, 'dialog--open');
            addClass(that.options.id, 'dialog--close');
            if (that.options.onAfterDialogClose) {
                that.options.onAfterDialogClose.call(this)
            }
        },
        'destroy': function () {
            var that = this;
            if (that.options.onBeforeDialogDestroy) {
                that.options.onBeforeDialogDestroy.call(this)
            }
            var _dialog = document.getElementById(that.options.id);
            if (_dialog) {
                document.body.removeChild(_dialog);
            }
            if(that.options.onAfterDialogDestroy){
                that.options.onAfterDialogDestroy.call(this);
            }
        }
    }
    /**
     * 获取某子节点
     */
    getChildNodeByClass = function (parentId, childClassName) {
        var parent = document.getElementById(parentId),
            childs = parent.children || parent.childNodes,
            childs_length = childs.length;
        for (var i = 0; i < childs_length; i++) {
            var child = childs[i];
            if (child.nodeType == '1' && child.className == childClassName) {
                return child;
            }
        }
        return '';
    }
    /**
     * 为节点添加className
     * @param id
     * @param classes
     * @returns {HTMLElement}
     */
    addClass = function (id, classes) {
        var dom = document.getElementById(id);
        var class_arr = classes.split(/\s+/),
            g = dom.className,
            a = " " + g + " ",
            b = class_arr.length;
        for (var f = 0; f < b; f++) {
            if (a.indexOf(" " + class_arr[f] + " ") < 0) {
                g += (g ? " " : "") + class_arr[f]
            }
        }
        dom.className = g
        return dom;
    }
    removeClass = function (id, classes) {
        var dom = document.getElementById(id);
        var a = dom.className.split(/\s+/),
            k = classes.split(/\s+/),
            g,
            f = k.length, b, d = 0;
        for (; d < f; ++d) for (b = 0, g = a.length; b < g; ++b) if (a[b] == k[d]) {
            a.splice(b, 1);
            break;
        }
        dom.className = a.join(" ");
        return dom;
    }

}(window, undefined));
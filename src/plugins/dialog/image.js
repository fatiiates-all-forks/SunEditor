/*
 * wysiwyg web editor
 *
 * suneditor.js
 * Copyright 2017 JiHong Lee.
 * MIT license.
 */
SUNEDITOR.plugin.image = {
    add: function (_this) {
        const context = _this.context;
        context.image = {
            _imageElementLink: null,
            _imageElement: null,
            _imageElement_w: 1,
            _imageElement_h: 1,
            _imageElement_l: 0,
            _imageElement_t: 0,
            _imageClientX: 0,
            _imageResize_parent_t: 0,
            _imageResize_parent_l: 0,
            _altText: '',
            _imageCaption: null,
            _linkValue: '',
            _align: 'none',
            _captionChecked: false
        };

        /** image dialog */
        const image_dialog = eval(this.setDialog(_this.context.user));
        context.image.modal = image_dialog;
        context.image.focusElement = image_dialog.getElementsByClassName('sun-editor-id-image-url')[0];
        context.image.imgInputFile = image_dialog.getElementsByClassName('sun-editor-id-image-file')[0];
        context.image.altText = image_dialog.getElementsByClassName('sun-editor-id-image-alt')[0];
        context.image.imgLink = image_dialog.getElementsByClassName('sun-editor-id-image-link')[0];
        context.image.imgLinkNewWindowCheck = image_dialog.getElementsByClassName('sun-editor-id-linkCheck')[0];
        context.image.caption = image_dialog.querySelector('#suneditor_image_check_caption');
        context.image.imageX = image_dialog.getElementsByClassName('sun-editor-id-image-x')[0];
        context.image.imageY = image_dialog.getElementsByClassName('sun-editor-id-image-y')[0];

        context.image.imageX.value = _this.context.user.imageSize;

        /** image resize controller, button */
        const resize_img_div = eval(this.setController_ImageResizeController());
        context.image.imageResizeDiv = resize_img_div;
        context.image.imageResizeDisplay = resize_img_div.getElementsByClassName('sun-editor-id-img-display')[0];

        const resize_img_button = eval(this.setController_ImageButton());
        context.image.imageResizeBtn = resize_img_button;

        /** add event listeners */
        context.image.modal.getElementsByClassName('sun-editor-tab-button')[0].addEventListener('click', this.openTab.bind(_this));
        context.image.modal.getElementsByClassName('btn-primary')[0].addEventListener('click', this.submit_dialog.bind(_this));
        resize_img_div.getElementsByClassName('sun-editor-img-controller')[0].addEventListener('mousedown', this.onMouseDown_image_ctrl.bind(_this, 'l'));
        resize_img_div.getElementsByClassName('sun-editor-img-controller')[1].addEventListener('mousedown', this.onMouseDown_image_ctrl.bind(_this, 'r'));
        context.image.imageResizeBtn.addEventListener('click', this.onClick_imageResizeBtn.bind(_this));
        context.image.imageX.addEventListener('change', this.setImageSizeInput.bind(_this, 'x'));
        context.image.imageY.addEventListener('change', this.setImageSizeInput.bind(_this, 'y'));

        /** append html */
        context.dialog.modal.appendChild(image_dialog);
        context.element.relative.appendChild(resize_img_div);
        context.element.relative.appendChild(resize_img_button);
    },

    /** dialog */
    setDialog: function (user) {
        const lang = SUNEDITOR.lang;
        const dialog = document.createElement('DIV');
        dialog.className = 'modal-content sun-editor-id-dialog-image';
        dialog.style.display = 'none';

        let html = '' +
			'<div class="modal-header">' +
			'   <button type="button" data-command="close" class="close" aria-label="Close">' +
			'       <span aria-hidden="true" data-command="close">x</span>' +
			'   </button>' +
			'   <h5 class="modal-title">' + lang.dialogBox.imageBox.title + '</h5>' +
			'</div>' +
            '<div class="sun-editor-tab-button">' +
            '   <button type="button" class="sun-editor-id-tab-link active" data-tab-link="image">' + lang.toolbar.image + '</button>' +
			'   <button type="button" class="sun-editor-id-tab-link" data-tab-link="url">' + lang.toolbar.link + '</button>' +
            '</div>' +
            '<form class="editor_image" method="post" enctype="multipart/form-data">' +
			'   <div class="sun-editor-id-tab-content sun-editor-id-tab-content-image">' +
            '       <div class="modal-body">';

            if (user.imageFileInput) {
                html += '' +
                    '   <div class="form-group">' +
                    '       <label>' + lang.dialogBox.imageBox.file + '</label>' +
                    '       <input class="form-control sun-editor-id-image-file" type="file" accept="image/*" multiple="multiple" />' +
                    '   </div>' ;
            }

            if (user.imageUrlInput) {
                html += '' +
                    '   <div class="form-group">' +
                    '       <label>' + lang.dialogBox.imageBox.url + '</label>' +
                    '       <input class="form-control sun-editor-id-image-url" type="text" />' +
                    '   </div>';
            }

            html += '' +
            '           <div class="form-group">' +
            '               <label>' + lang.dialogBox.imageBox.altText + '</label><input class="form-control sun-editor-id-image-alt" type="text" />' +
            '           </div>' +
            '           <div class="form-group">' +
            '               <div class="size-text"><label class="size-w">' + lang.dialogBox.width + '</label><label class="size-x">&nbsp;</label><label class="size-h">' + lang.dialogBox.height + '</label></div>' +
            '               <input class="form-size-control sun-editor-id-image-x" type="number" min="1" /><label class="size-x">x</label><input class="form-size-control sun-editor-id-image-y" type="number" min="1" disabled />' +
            '           </div>' +
            '           <div class="form-group-footer">' +
            '               <input type="checkbox" id="suneditor_image_check_caption" /><label for="suneditor_image_check_caption">&nbsp;' + lang.dialogBox.imageBox.caption + '</label>' +
            '           </div>' +
            '       </div>' +
			'   </div>' +
			'   <div class="sun-editor-id-tab-content sun-editor-id-tab-content-url" style="display: none">' +
			'       <div class="modal-body">' +
			'           <div class="form-group">' +
			'               <label>' + lang.dialogBox.linkBox.url + '</label><input class="form-control sun-editor-id-image-link" type="text" />' +
			'           </div>' +
            '           <label><input type="checkbox" class="sun-editor-id-linkCheck" />&nbsp;' + lang.dialogBox.linkBox.newWindowCheck + '</label>' +
			'       </div>' +
			'   </div>' +
			'   <div class="modal-footer">' +
            '       <div style="float: left;">' +
			'           <input type="radio" id="suneditor_image_radio_none" name="suneditor_image_radio" class="modal-radio" value="none" checked><label for="suneditor_image_radio_none">' + lang.dialogBox.basic + '</label>' +
			'           <input type="radio" id="suneditor_image_radio_left" name="suneditor_image_radio" class="modal-radio" value="left"><label for="suneditor_image_radio_left">' + lang.dialogBox.left + '</label>' +
            '           <input type="radio" id="suneditor_image_radio_center" name="suneditor_image_radio" class="modal-radio" value="center"><label for="suneditor_image_radio_center">' + lang.dialogBox.center + '</label>' +
            '           <input type="radio" id="suneditor_image_radio_right" name="suneditor_image_radio" class="modal-radio" value="right"><label for="suneditor_image_radio_right">' + lang.dialogBox.right + '</label>' +
            '       </div>' +
			'       <button type="submit" class="btn btn-primary sun-editor-id-submit-image"><span>' + lang.dialogBox.submitButton + '</span></button>' +
			'   </div>' +
            '</form>';

        dialog.innerHTML = html;

        return dialog;
    },

	openTab: function (e) {
        const targetElement = (e === 'init' ? document.getElementsByClassName('sun-editor-id-tab-link')[0] : e.target);

		if (!/^BUTTON$/i.test(targetElement.tagName)) {
			return false;
		}

		// Declare all variables
        const tabName = targetElement.getAttribute('data-tab-link');
        const contentClassName = 'sun-editor-id-tab-content';
        let i, tabcontent, tablinks;

		// Get all elements with class="tabcontent" and hide them
		tabcontent = document.getElementsByClassName(contentClassName);
		for (i = 0; i < tabcontent.length; i++) {
			tabcontent[i].style.display = 'none';
		}

		// Get all elements with class="tablinks" and remove the class "active"
		tablinks = document.getElementsByClassName('sun-editor-id-tab-link');
		for (i = 0; i < tablinks.length; i++) {
		    SUNEDITOR.dom.removeClass(tablinks[i], 'active');
		}

		// Show the current tab, and add an "active" class to the button that opened the tab
        this.context.image.modal.getElementsByClassName(contentClassName + '-' + tabName)[0].style.display = 'block';
        SUNEDITOR.dom.addClass(targetElement, 'active');

        // focus
        if (tabName === 'image') {
            this.context.image.focusElement.focus();
        } else if (tabName === 'url') {
            this.context.image.imgLink.focus();
        }

		return false;
	},

    xmlHttp: null,

    onRender_imgInput: function () {
        function inputAction(files) {
            if (files.length > 0) {
                const imageUploadUrl = this.context.user.imageUploadUrl;
                const filesLen = this.context.dialog.updateModal ? 1 : files.length;

                if (imageUploadUrl !== null && imageUploadUrl.length > 0) {
                    const formData = new FormData();

                    for (let i = 0; i < filesLen; i++) {
                        formData.append('file-' + i, files[i]);
                    }

                    SUNEDITOR.plugin.image.xmlHttp = SUNEDITOR.util.getXMLHttpRequest();
                    SUNEDITOR.plugin.image.xmlHttp.onreadystatechange = SUNEDITOR.plugin.image.callBack_imgUpload.bind(this, this.context.image._linkValue, this.context.image.imgLinkNewWindowCheck.checked, this.context.image.imageX.value + 'px', this.context.image._align, this.context.dialog.updateModal);
                    SUNEDITOR.plugin.image.xmlHttp.open('post', imageUploadUrl, true);
                    SUNEDITOR.plugin.image.xmlHttp.send(formData);
                } else {
                    for (let i = 0; i < filesLen; i++) {
                        SUNEDITOR.plugin.image.setup_reader.call(this, files[i], this.context.image._linkValue, this.context.image.imgLinkNewWindowCheck.checked, this.context.dialog.updateModal);
                    }
                }
            }
        }

        try {
            inputAction.call(this, this.context.image.imgInputFile.files);
        } catch (e) {
            this.closeLoading();
            throw Error('[SUNEDITOR.imageUpload.fail] cause : "' + e.message + '"');
        }
    },

    setup_reader: function (file, imgLinkValue, newWindowCheck, update) {
        const reader = new FileReader();

        reader.onload = function (update) {
            SUNEDITOR.plugin.image.create_image.call(this, reader.result, imgLinkValue, newWindowCheck, this.context.image.imageX.value + 'px', this.context.image._align, update);
        }.bind(this, update);

        reader.readAsDataURL(file);
    },

    callBack_imgUpload: function (linkValue, linkNewWindow, width, align, update) {
        const xmlHttp = SUNEDITOR.plugin.image.xmlHttp;
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) {
                const result = eval(xmlHttp.responseText);

                for (let i = 0, len = (update && result.length > 0 ? 1 : result.length); i < len; i++) {
                    SUNEDITOR.plugin.image.create_image.call(this, result[i].SUNEDITOR_IMAGE_SRC, linkValue, linkNewWindow, width, align, update);
                }
            } else {
                window.open('', '_blank').document.writeln(xmlHttp.responseText);
            }

            this.closeLoading();
        }
    },

    onRender_imgUrl: function () {
        if (this.context.image.focusElement.value.trim().length === 0) return false;

        try {
            SUNEDITOR.plugin.image.create_image.call(this, this.context.image.focusElement.value, this.context.image._linkValue, this.context.image.imgLinkNewWindowCheck.checked, this.context.image.imageX.value + 'px', this.context.image._align);
        } catch (e) {
            this.closeLoading();
            throw Error('[SUNEDITOR.inseretImageUrl.fail] cause : "' + e.message + '"');
        }
    },

    onRender_link: function (imgTag, imgLinkValue, newWindowCheck) {
        if (imgLinkValue.trim().length > 0) {
            const link = document.createElement('A');
            link.href = /^https?:\/\//.test(imgLinkValue) ? imgLinkValue : 'http://' + imgLinkValue;
            link.target = (newWindowCheck ? '_blank' : '');
            link.setAttribute('data-image-link', 'image');
            link.addEventListener('click', function (e) { e.preventDefault(); });

            imgTag.setAttribute('data-image-link', imgLinkValue);
            imgTag.style.padding = '1px';
            imgTag.style.margin = '1px';
            imgTag.style.outline = '1px solid #f4b124';

            link.appendChild(imgTag);
            return link;
        }

        return imgTag;
    },

    setImageSizeInput: function (xy) {
        if (!this.context.dialog.updateModal) return;

        if (xy === 'x') {
            this.context.image.imageY.value = Math.round((this.context.image._imageElement_h / this.context.image._imageElement_w) * this.context.image.imageX.value);
        } else {
            this.context.image.imageX.value = Math.round((this.context.image._imageElement_w / this.context.image._imageElement_h) * this.context.image.imageY.value);
        }
    },

    submit_dialog: function (e) {
        this.showLoading();

        e.preventDefault();
        e.stopPropagation();

        this.context.image._linkValue = this.context.image.imgLink.value;
        this.context.image._altText = this.context.image.altText.value;
        this.context.image._align = this.context.image.modal.querySelector('input[name="suneditor_image_radio"]:checked').value;
        this.context.image._captionChecked = this.context.image.caption.checked;

        try {
            if (this.context.dialog.updateModal) {
                SUNEDITOR.plugin.image.update_image.call(this);
            } else {
                SUNEDITOR.plugin.image.onRender_imgInput.call(this);
                SUNEDITOR.plugin.image.onRender_imgUrl.call(this);
            }
        } finally {
            SUNEDITOR.plugin.dialog.closeDialog.call(this);
            this.closeLoading();
        }

        return false;
    },

    create_image: function (src, linkValue, linkNewWindow, width, align, update) {
        if (update) {
            this.context.image._imageElement.src = src;
            return;
        }

        let oImg = document.createElement('IMG');
        const cover = document.createElement('FIGURE');
        const container = document.createElement('DIV');

        oImg.src = src;
        oImg.style.width = width;
        oImg.setAttribute('data-align', align);
        oImg.alt = this.context.image._altText;
        oImg = SUNEDITOR.plugin.image.onRender_link(oImg, linkValue, linkNewWindow);

        cover.className = 'sun-editor-image-cover';
        cover.appendChild(oImg);

        // caption
        if (this.context.image._captionChecked) {
            const caption = document.createElement('FIGCAPTION');
            caption.innerHTML = '<p>&#65279</p>';
            caption.setAttribute('contenteditable', true);
            cover.appendChild(caption);
        }

        container.className = 'sun-editor-id-image-container';
        container.setAttribute('contenteditable', false);
        container.style.textAlign = 'center';
        container.appendChild(cover);

        // align
        if ('center' !== align) {
            container.style.display = 'inline-block';
            container.style.float = align;
        }

        this.insertNode(container, this.getLineElement(this.getSelectionNode()));
        this.appendP(container);
    },

    update_image: function () {
        const contextImage = this.context.image;
        const linkValue = contextImage._linkValue;
        const container = SUNEDITOR.dom.getParentNode(contextImage._imageElement, '.sun-editor-id-image-container') || contextImage._imageElement;
        const cover = SUNEDITOR.dom.getParentNode(contextImage._imageElement, '.sun-editor-image-cover');
        let newEl;

        if (contextImage.imgInputFile.value.length === 0 && contextImage.focusElement.value.trim().length === 0) {
            SUNEDITOR.dom.removeItem(container);
            return;
        }

        // input update
        SUNEDITOR.plugin.image.onRender_imgInput.call(this);

        // src, size
        contextImage._imageElement.src = contextImage.focusElement.value;
        contextImage._imageElement.alt = contextImage._altText;
        contextImage._imageElement.style.width = contextImage.imageX.value + 'px';
        contextImage._imageElement.style.height = contextImage.imageY.value + 'px';

        // caption
        if (contextImage._captionChecked) {
            if (contextImage._imageCaption === null) {
                const caption = document.createElement('FIGCAPTION');
                caption.innerHTML = '<p>&#65279</p>';
                caption.setAttribute('contenteditable', true);
                cover.appendChild(caption);
            }
        } else {
            if (!!contextImage._imageCaption) {
                SUNEDITOR.dom.removeItem(contextImage._imageCaption);
            }
        }

        // align
        if ('center' !== contextImage._align) {
            container.style.display = 'inline-block';
            container.style.float = contextImage._align;
        } else {
            container.style.display = '';
            container.style.float = 'none';
        }

        contextImage._imageElement.setAttribute('data-align', contextImage._align);

        // link
        if (linkValue.trim().length > 0) {
            if (contextImage._imageElementLink !== null) {
                contextImage._imageElementLink.href = linkValue;
                contextImage._imageElementLink.target = this.context.image.imgLinkNewWindowCheck.checked;
                contextImage._imageElement.setAttribute('data-image-link', linkValue);
            } else {
                newEl = SUNEDITOR.plugin.image.onRender_link(contextImage._imageElement.cloneNode(true), linkValue, this.context.image.imgLinkNewWindowCheck.checked);
                cover.innerHTML = '';
                cover.appendChild(newEl);
            }
        }
        else if (contextImage._imageElementLink !== null) {
            const imageElement = contextImage._imageElement;

            imageElement.setAttribute('data-image-link', '');
            imageElement.style.padding = '';
            imageElement.style.margin = '';
            imageElement.style.outline = '';

            newEl = imageElement.cloneNode(true);
            cover.innerHTML = '';
            cover.appendChild(newEl);
        }
    },

    init: function () {
        this.context.image.imgInputFile.value = '';
        this.context.image.focusElement.value = '';
        this.context.image.altText.value = '';
        this.context.image.imgLink.value = '';
        this.context.image.imgLinkNewWindowCheck.checked = false;
        this.context.image.modal.querySelector('#suneditor_image_radio_none').checked = true;
        this.context.image.caption.checked = false;
        this.context.image.imageX.value = this.context.user.imageSize;
        this.context.image.imageY.value = '';
        this.context.image.imageY.disabled = true;
        SUNEDITOR.plugin.image.openTab.call(this, 'init');
    },

    /** image resize controller, button*/
    setController_ImageResizeController: function () {
        const resize_img_div = document.createElement('DIV');
        resize_img_div.className = 'modal-image-resize';
        resize_img_div.style.display = 'none';
        resize_img_div.innerHTML = '' +
            '<div class="image-resize-dot tl"></div>' +
            '<div class="image-resize-dot tr"></div>' +
            '<div class="image-resize-dot bl sun-editor-img-controller"></div>' +
            '<div class="image-resize-dot br sun-editor-img-controller"></div>' +
            '<div class="image-size-display sun-editor-id-img-display"></div>';

        return resize_img_div;
    },

    setController_ImageButton: function () {
        const lang = SUNEDITOR.lang;
        const resize_img_button = document.createElement("DIV");
        resize_img_button.className = "image-resize-btn";
        resize_img_button.style.display = "none";
        resize_img_button.innerHTML = '' +
            '<div class="btn-group">' +
            '   <button type="button" data-command="100" title="' + lang.dialogBox.imageBox.resize100 + '"><span class="note-fontsize-10">100%</span></button>' +
            '   <button type="button" data-command="75" title="' + lang.dialogBox.imageBox.resize75 + '"><span class="note-fontsize-10">75%</span></button>' +
            '   <button type="button" data-command="50" title="' + lang.dialogBox.imageBox.resize50 + '"><span class="note-fontsize-10">50%</span></button>' +
            '   <button type="button" data-command="25" title="' + lang.dialogBox.imageBox.resize25 + '"><span class="note-fontsize-10">25%</span></button>' +
            '   <button type="button" data-command="update" title="' + lang.toolbar.image + '" style="padding: 6px 10px !important;"><div class="ico_picture"></div></button>' +
            '</div>' +
            '<div class="btn-group remove">' +
            '   <button type="button" data-command="delete" title="' + lang.dialogBox.imageBox.remove + '"><span class="image_remove">x</span></button>' +
            '</div>';

        return resize_img_button;
    },

    call_controller_imageResize: function (targetElement) {
        /** ie,firefox image resize handle : false*/
        targetElement.setAttribute('unselectable', 'on');
        targetElement.contentEditable = false;

        const resizeDiv = this.context.image.imageResizeDiv;
        const w = targetElement.offsetWidth;
        const h = targetElement.offsetHeight;

        let parentElement = targetElement.offsetParent;
        let parentT = 0;
        let parentL = 0;
        while (parentElement) {
            parentT += (parentElement.offsetTop + parentElement.clientTop);
            parentL += (parentElement.offsetLeft + +parentElement.clientLeft);
            parentElement = parentElement.offsetParent;
        }
        this.context.image._imageResize_parent_t = (this.context.tool.bar.offsetHeight + parentT);
        this.context._imageResize_parent_l = parentL;

        const t = (targetElement.offsetTop + this.context.image._imageResize_parent_t - this.context.element.wysiwygWindow.document.body.scrollTop);
        const l = (targetElement.offsetLeft + parentL);

        resizeDiv.style.top = t + 'px';
        resizeDiv.style.left = l + 'px';
        resizeDiv.style.width = w + 'px';
        resizeDiv.style.height = h + 'px';

        this.context.image.imageResizeBtn.style.top = (h + t) + 'px';
        this.context.image.imageResizeBtn.style.left = l + 'px';

        SUNEDITOR.dom.changeTxt(this.context.image.imageResizeDisplay, w + ' x ' + h);

        this.context.image._imageElementLink = /^A$/i.test(targetElement.parentNode.nodeName) ? targetElement.parentNode : null;
        this.context.image._imageElement = targetElement;
        this.context.image._imageCaption = targetElement.nextSibling;
        this.context.image._imageElement_w = w;
        this.context.image._imageElement_h = h;
        this.context.image._imageElement_t = t;
        this.context.image._imageElement_l = l;

        this.context.image.imageResizeDiv.style.display = 'block';
        this.context.image.imageResizeBtn.style.display = 'block';

        this.controllerArray = [this.context.image.imageResizeDiv, this.context.image.imageResizeBtn];
    },

    cancel_controller_imageResize: function () {
        this.context.element.resizeBackground.style.display = 'none';
        this.context.image.imageResizeDiv.style.display = 'none';
        this.context.image.imageResizeBtn.style.display = 'none';
        this.context.image._imageElement = null;
    },

    onClick_imageResizeBtn: function (e) {
        e.stopPropagation();

        const command = e.target.getAttribute('data-command') || e.target.parentNode.getAttribute('data-command');
        if (!command) return;

        e.preventDefault();

        const contextImage = this.context.image;

        if (/^\d+$/.test(command)) {
            contextImage._imageElement.style.height = '';
            contextImage._imageElement.style.width = command + '%';
        }
        else if (/update/.test(command)) {
            contextImage.focusElement.value = contextImage._imageElement.src;
            contextImage.altText.value = contextImage._imageElement.alt;
            contextImage.imgLink.value = contextImage._imageElementLink === null ? '' : contextImage._imageElementLink.href;
            contextImage.imgLinkNewWindowCheck.checked = !contextImage._imageElementLink || contextImage._imageElementLink.target === '_blank';
            contextImage.modal.querySelector('#suneditor_image_radio_' + (contextImage._imageElement.getAttribute('data-align') || 'none')).checked = true;
            contextImage._captionChecked = contextImage.caption.checked = !!contextImage._imageCaption;
            contextImage.imageX.value = contextImage._imageElement.offsetWidth;
            contextImage.imageY.value = contextImage._imageElement.offsetHeight;
            this.context.image.imageY.disabled = false;

            SUNEDITOR.plugin.dialog.openDialog.call(this, 'image', null, true);
        }
        else if (/delete/.test(command)) {
            const imageContainer = SUNEDITOR.dom.getParentNode(contextImage._imageElement, '.sun-editor-id-image-container') || contextImage._imageElement;
            SUNEDITOR.dom.removeItem(imageContainer);
        }

        this.submenuOff();
        this.focus();
    },

    onMouseDown_image_ctrl: function (direction) {
        const e = window.event;
        e.stopPropagation();
        e.preventDefault();

        this.context.image._imageClientX = e.clientX;
        this.context.element.resizeBackground.style.display = 'block';
        this.context.image.imageResizeBtn.style.display = 'none';

        function closureFunc() {
            SUNEDITOR.plugin.image.cancel_controller_imageResize.call(this);
            document.removeEventListener('mousemove', resize_image_bind);
            document.removeEventListener('mouseup', closureFunc_bind);
        }

        const resize_image_bind = SUNEDITOR.plugin.image.resize_image.bind(this, direction);
        const closureFunc_bind = closureFunc.bind(this);

        document.addEventListener('mousemove', resize_image_bind);
        document.addEventListener('mouseup', closureFunc_bind);
    },

    resize_image: function (direction) {
        const e = window.event;
        const w = this.context.image._imageElement_w + (direction === 'r' ? e.clientX - this.context.image._imageClientX : this.context.image._imageClientX - e.clientX);
        const h = ((this.context.image._imageElement_h / this.context.image._imageElement_w) * w);

        this.context.image._imageElement.style.width = w + 'px';
        this.context.image._imageElement.style.height = h + 'px';

        let parentElement = this.context.image._imageElement.offsetParent;
        let parentT = 0;
        let parentL = 0;
        while (parentElement) {
            parentT += (parentElement.offsetTop + parentElement.clientTop);
            parentL += (parentElement.offsetLeft + parentElement.clientLeft);
            parentElement = parentElement.offsetParent;
        }

        const t = (this.context.image._imageElement.offsetTop + this.context.image._imageResize_parent_t - this.context.element.wysiwygWindow.document.body.scrollTop);
        const l = (this.context.image._imageElement.offsetLeft + parentL);

        this.context.image.imageResizeDiv.style.top = t + 'px';
        this.context.image.imageResizeDiv.style.left = l + 'px';
        this.context.image.imageResizeDiv.style.width = w + 'px';
        this.context.image.imageResizeDiv.style.height = h + 'px';

        SUNEDITOR.dom.changeTxt(this.context.image.imageResizeDisplay, Math.round(w) + ' x ' + Math.round(h));
    }
};
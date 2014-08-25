/**
 * Get blured image
 *
 * @module blur_img
 * @requires load_img
 *
 * @version r2
 * @author Viacheslav Lotsmanov
 * @license GNU/GPLv3 by Free Software Foundation (https://github.com/unclechu/js-useful-amd-modules/blob/master/GPLv3-LICENSE)
 * @see {@link https://github.com/unclechu/js-useful-amd-modules/|GitHub}
 * @copyright Based on https://github.com/jakiestfu/Blur.js
 */

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD (RequireJS)
		define(['jquery', 'load_img'], function ($, loadImg) {
			factory($, loadImg, window, window.document);
		});
	} else if (typeof module === 'object' && typeof module.exports === 'object') {
		// CommonJS (Browserify)
		module.exports = factory(
			require('jquery'), require('load_img'), window, window.document);
	} else {
		throw new Error('Unsupported architecture');
	}
})(function ($, loadImg, window, document, undefined) {

	'use strict';

	// helpers {{{1

	// Stackblur, courtesy of Mario Klingemann: http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html
	var mul_table = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456,
		388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388,
		360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328,
		312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360,
		347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454,
		441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312,
		305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456,
		446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347,
		341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273,
		269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441,
		435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364,
		359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305,
		301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259,
		257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446,
		442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388,
		385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341,
		338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302,
		299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269,
		267, 265, 263, 261, 259];
	var shg_table = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16,
		17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19,
		19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20,
		20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21,
		21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
		21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
		22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
		22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24];

	function inherit(proto) {
		if (Object.create) return Object.create(proto);
		function F() {}
		F.prototype = proto;
		return new F();
	}

	// helpers }}}1

	/**
	 * @private
	 * @inner
	 */
	function stackBlurCanvasRGB(canvas, b, c, width, height, radius) {
		var a = canvas;
		var d = width;
		var f = height;
		var g = radius;

		if (isNaN(g) || g < 1) return;
		g |= 0;
		var h = a.getContext("2d");
		var j;
		try {
			try {
				j = h.getImageData(b, c, d, f);
			} catch(e) {
				try {
					window.netscape.security.PrivilegeManager
						.enablePrivilege("UniversalBrowserRead");
					j = h.getImageData(b, c, d, f);
				} catch(e) {
					window.alert("Cannot access local image");
					throw new Error("unable to access local image data: " + e);
				}
			}
		} catch(e) {
			window.alert("Cannot access image");
			throw new Error("unable to access image data: " + e);
		}
		var k = j.data;
		var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, r_out_sum, g_out_sum,
			b_out_sum, r_in_sum, g_in_sum, b_in_sum, pr, pg, pb, rbs;
		var l = g + g + 1;
		//var m = d << 2;
		var n = d - 1;
		var o = f - 1;
		var q = g + 1;
		var r = q * (q + 1) / 2;
		var s = new BlurStack();
		var t = s;
		var u;
		for(i = 1; i < l; i++) {
			t = t.next = new BlurStack();
			if(i == q) u = t;
		}
		t.next = s;
		var v = null;
		var w = null;
		yw = yi = 0;
		var z = mul_table[g];
		var A = shg_table[g];
		for(y = 0; y < f; y++) {
			r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;
			r_out_sum = q * (pr = k[yi]);
			g_out_sum = q * (pg = k[yi + 1]);
			b_out_sum = q * (pb = k[yi + 2]);
			r_sum += r * pr;
			g_sum += r * pg;
			b_sum += r * pb;
			t = s;
			for(i = 0; i < q; i++) {
				t.r = pr;
				t.g = pg;
				t.b = pb;
				t = t.next;
			}
			for(i = 1; i < q; i++) {
				p = yi + ((n < i ? n : i) << 2);
				r_sum += (t.r = (pr = k[p])) * (rbs = q - i);
				g_sum += (t.g = (pg = k[p + 1])) * rbs;
				b_sum += (t.b = (pb = k[p + 2])) * rbs;
				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				t = t.next;
			}
			v = s;
			w = u;
			for(x = 0; x < d; x++) {
				k[yi] = (r_sum * z) >> A;
				k[yi + 1] = (g_sum * z) >> A;
				k[yi + 2] = (b_sum * z) >> A;
				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				r_out_sum -= v.r;
				g_out_sum -= v.g;
				b_out_sum -= v.b;
				p = (yw + ((p = x + g + 1) < n ? p : n)) << 2;
				r_in_sum += (v.r = k[p]);
				g_in_sum += (v.g = k[p + 1]);
				b_in_sum += (v.b = k[p + 2]);
				r_sum += r_in_sum;
				g_sum += g_in_sum;
				b_sum += b_in_sum;
				v = v.next;
				r_out_sum += (pr = w.r);
				g_out_sum += (pg = w.g);
				b_out_sum += (pb = w.b);
				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				w = w.next;
				yi += 4;
			}
			yw += d;
		}
		for(x = 0; x < d; x++) {
			g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;
			yi = x << 2;
			r_out_sum = q * (pr = k[yi]);
			g_out_sum = q * (pg = k[yi + 1]);
			b_out_sum = q * (pb = k[yi + 2]);
			r_sum += r * pr;
			g_sum += r * pg;
			b_sum += r * pb;
			t = s;
			for(i = 0; i < q; i++) {
				t.r = pr;
				t.g = pg;
				t.b = pb;
				t = t.next;
			}
			yp = d;
			for(i = 1; i <= g; i++) {
				yi = (yp + x) << 2;
				r_sum += (t.r = (pr = k[yi])) * (rbs = q - i);
				g_sum += (t.g = (pg = k[yi + 1])) * rbs;
				b_sum += (t.b = (pb = k[yi + 2])) * rbs;
				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				t = t.next;
				if(i < o) {
					yp += d;
				}
			}
			yi = x;
			v = s;
			w = u;
			for(y = 0; y < f; y++) {
				p = yi << 2;
				k[p] = (r_sum * z) >> A;
				k[p + 1] = (g_sum * z) >> A;
				k[p + 2] = (b_sum * z) >> A;
				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				r_out_sum -= v.r;
				g_out_sum -= v.g;
				b_out_sum -= v.b;
				p = (x + (((p = y + q) < o ? p : o) * d)) << 2;
				r_sum += (r_in_sum += (v.r = k[p]));
				g_sum += (g_in_sum += (v.g = k[p + 1]));
				b_sum += (b_in_sum += (v.b = k[p + 2]));
				v = v.next;
				r_out_sum += (pr = w.r);
				g_out_sum += (pg = w.g);
				b_out_sum += (pb = w.b);
				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				w = w.next;
				yi += d;
			}
		}
		h.putImageData(j, b, c);
	}

	/**
	 * @private
	 * @inner
	 * @constructor
	 */
	function BlurStack() {
		this.r = 0;
		this.g = 0;
		this.b = 0;
		this.a = 0;
		this.next = null;
	}

	/**
	 * @typedef {function} blurImg~callback
	 * @param {Error|Null} err
	 * @param {string} dataURL
	 */

	/**
	 * @typedef {Object.<*>} blurImg~params
	 * @prop {string} src
	 * @prop {number} [radius=5]
	 */

	/**
	 * @public
	 * @static
	 * @param {blurImg~params} params
	 * @param {blurImg~callback} callback
	 */
	function blurImg(params, callback) {

		params = $.extend({
			src: null,
			radius: 10,
		}, params);

		if (typeof Image !== 'function') {
			callback(new blurImg.exceptions.NoImage());
			return;
		}

		var canvas = document.createElement('canvas');
		var ctx, imgObj, dataURL;

		if (canvas.getContext) {
			ctx = canvas.getContext('2d');
			if (!ctx) {
				callback(new blurImg.exceptions.CanvasIsNotSupported());
				return;
			}
		} else {
			callback(new blurImg.exceptions.CanvasIsNotSupported());
			return;
		}

		loadImg(params.src, function (loadImgErr, img) {

			if (loadImgErr) { callback(loadImgErr); return; }

			imgObj = new Image();

			imgObj.src = img.src;
			canvas.width = imgObj.width;
			canvas.height = imgObj.height;

			try {
				ctx.drawImage(imgObj, 0, 0);
			} catch (err) {
				callback(new blurImg.exceptions.DrawImageError(null, err));
				return;
			}

			stackBlurCanvasRGB(canvas, 0, 0, canvas.width, canvas.height, params.radius);

			try {
				dataURL = canvas.toDataURL('image/png');
			} catch (err) {
				callback(new blurImg.exceptions.ConvertToDataURLError(null, err));
				return;
			}

			// async
			setTimeout($.proxy(callback, null, null, dataURL), 1);

		}); // loadImg()

	} // blurImg()

	/* exceptions {{{1 */

	/**
	 * @public
	 * @static
	 */
	blurImg.exceptions = {};
	var exceptions = blurImg.exceptions;

	exceptions.NoImage = function (message) {
		Error.call(this);
		this.name = 'NoImage';
		this.message = message || 'No "Image" constructor.';
	};

	exceptions.CanvasIsNotSupported = function (message) {
		Error.call(this);
		this.name = 'CanvasIsNotSupported';
		this.message = message || 'Canvas is not supported.';
	};

	exceptions.DrawImageError = function (message, err) {
		Error.call(this);
		this.name = 'DrawImageError';
		this.message = message || 'Draw image to 2D canvas context error.';
		if (err) this.message += ('\n\n' + err.toString());
	};

	exceptions.ConvertToDataURLError = function (message, err) {
		Error.call(this);
		this.name = 'ConvertToDataURLError';
		this.message = message || 'Convert image data from 2D canvas to URL data error.';
		if (err) this.message += ('\n\n' + err.toString());
	};

	for (var key in blurImg.exceptions) {
		exceptions[key].prototype = inherit(Error.prototype);
	}

	/* exceptions }}}1 */

	return blurImg;

}); // factory()

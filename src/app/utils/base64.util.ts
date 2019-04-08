export let Base64Util = {
    randomUUID: function () {
        let s = []
        let hexDigits = '0123456789abcdef'
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
        }
        s[14] = '4'  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = '-'

        let uuid = s.join('')
        return uuid
    },
    // 生成64位UUID
    random64UUID: function () {
        let before = Base64Util.randomUUID()
        let after = Base64Util.randomUUID()
        return before.replace(/-/g, '') + after.replace(/-/g, '')
    },
    /**
     * 带货币符金额转数字
     */
    getMoney: function (str) {
        if (!str) {
            return 0
        }
        if (str.toString().startWith('￥') || str.toString().startWith('$')) {
            return Number(str.substring(1))
        } else {
            return Number(str) ? Number(str) : 0
        }
    },
    Base64: function () { // 密码加密和解密
        // private property
        let _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

        // public method for encoding
        let _this = this
        this.encode = function (input) { // 加密
            let output = ''
            let chr1, chr2, chr3, enc1, enc2, enc3, enc4
            let i = 0
            input = _this._utf8_encode(input)
            while (i < input.length) {
                chr1 = input.charCodeAt(i++)
                chr2 = input.charCodeAt(i++)
                chr3 = input.charCodeAt(i++)
                enc1 = chr1 >> 2
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
                enc4 = chr3 & 63
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64
                } else if (isNaN(chr3)) {
                    enc4 = 64
                }
                output = output +
                    _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                    _keyStr.charAt(enc3) + _keyStr.charAt(enc4)
            }
            output = 'pmx' + output // 本行可注释，如果注释，this.decode方法内的 input = input.substr(3, input.length) 这行代码也要注释
            return output
        }

        // public method for decoding
        this.decode = function (input) { // 解密
            input = input.substr(3, input.length) // 本行可注释，如果注释，this.encode方法内的 output = 'pmx' + output 这行代码也要注释
            let output = ''
            let chr1, chr2, chr3
            let enc1, enc2, enc3, enc4
            let i = 0
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '')
            while (i < input.length) {
                enc1 = _keyStr.indexOf(input.charAt(i++))
                enc2 = _keyStr.indexOf(input.charAt(i++))
                enc3 = _keyStr.indexOf(input.charAt(i++))
                enc4 = _keyStr.indexOf(input.charAt(i++))
                chr1 = (enc1 << 2) | (enc2 >> 4)
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
                chr3 = ((enc3 & 3) << 6) | enc4
                output = output + String.fromCharCode(chr1)
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2)
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3)
                }
            }
            output = _this._utf8_decode(output)
            return output
        }

        // private method for UTF-8 encoding
        this._utf8_encode = function (string) {
            string = string.replace(/\r\n/g, '\n')
            let utftext = ''
            for (let n = 0; n < string.length; n++) {
                let c = string.charCodeAt(n)
                if (c < 128) {
                    utftext += String.fromCharCode(c)
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192)
                    utftext += String.fromCharCode((c & 63) | 128)
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224)
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128)
                    utftext += String.fromCharCode((c & 63) | 128)
                }

            }
            return utftext
        }

        // private method for UTF-8 decoding
        this._utf8_decode = function (utftext) {
            let string = ''
            let i = 0, c = 0,c1 = 0,c2 = 0,c3 = 0
            while (i < utftext.length) {
                c = utftext.charCodeAt(i)
                if (c < 128) {
                    string += String.fromCharCode(c)
                    i++
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1)
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
                    i += 2
                } else {
                    c2 = utftext.charCodeAt(i + 1)
                    c3 = utftext.charCodeAt(i + 2)
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
                    i += 3
                }
            }
            return string
        }
    }
}

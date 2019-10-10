module.exports = (({fromCharCode}) => {
  function read(fmt, bytes) {
    const helper = (fmt, bytes) => {
      if (fmt instanceof String) {
        return [bytes.slice(0, fmt.size), 
          bytes.slice(fmt.size)];
      } else if (fmt instanceof Number) {
        let value = 0;
        let sign = 0;
        for (let n = 0 ; n < fmt.size; n++) {
          const index = fmt.bigEndian ? 
            n : fmt.size - n - 1;
          let byte = bytes.charCodeAt(index);
          if (0 === n && fmt.signed) {
            sign = 0b10000000 & byte;
            byte = 0b1111111 & byte;
          }
          value += byte << 
            (8 * (fmt.size - n - 1));
        }
        
        if (fmt.signed && sign !== 0) {
          value *= -1;
        }

        return [value, bytes.slice(fmt.size)];

      } else if (fmt instanceof Struct) {
        const value = {};
        let bytes2 = bytes;
        for (const [key, fmt2] of 
          Object.entries(fmt.props)) {
          const pair = helper(fmt2, bytes2);
          value[key] = pair[0];
          bytes2 = pair[1];
        }
        return [value, bytes2];
      }
    };
    return helper(fmt, bytes)[0];
  }

  function write(fmt, data) {
    const helper = (fmt, data, bytes) => {
      if (fmt instanceof String) {
        return bytes + 
          data.padEnd(fmt.size, 
            fromCharCode(0));
      } else if (fmt instanceof Number) {
        const byteMask = (1 << 8) - 1;
        const sign = data < 0 && fmt.signed;
        if (data < 0) {
          data *= -1;
        }
        for (let n = 0 ; n < fmt.size; n++) {
          const shift = fmt.bigEndian ? 
            fmt.size - n - 1 : n;
          let byte = data >> (shift * 8) & 
            byteMask;
          if (fmt.size - 1 === shift && sign) {
            byte += 0b10000000;
          }
          bytes += fromCharCode(byte);
        }
        return bytes;

      } else if (fmt instanceof Struct) {
        for (const [key, fmt2] of 
          Object.entries(fmt.props)) {
          bytes += helper(fmt2, data[key], "");
        }
        return bytes;
      }
    };
    return helper(fmt, data, "");
  }

  function String(size) {
    if (this instanceof String === false) {
      return new String(size);
    }
    this.size = size;
  }

  function Number(size, signed, bigEndian) {
    if (this instanceof Number === false) {
      return new Number(size, signed, bigEndian);
    }
    this.size = size;
    this.signed = signed;
    this.bigEndian = bigEndian;
  }

  function Struct(props) {
    if (this instanceof Struct === false) {
      return new Struct(props);
    }
    this.props = props;
  }

  return {read, write, String, Number, Struct};
})(String);

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useWebSocket = void 0;

var _react = require("react");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Hook untuk mengelola koneksi WebSocket
var useWebSocket = function useWebSocket(url, onMessage, onError, onClose) {
  var _useState = (0, _react.useState)(null),
      _useState2 = _slicedToArray(_useState, 2),
      socket = _useState2[0],
      setSocket = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isConnected = _useState4[0],
      setIsConnected = _useState4[1];

  var _useState5 = (0, _react.useState)(0),
      _useState6 = _slicedToArray(_useState5, 2),
      reconnectAttempts = _useState6[0],
      setReconnectAttempts = _useState6[1];

  var openSocket = (0, _react.useCallback)(function () {
    var socket = new WebSocket(url);

    socket.onopen = function () {
      console.log('WebSocket terhubung');
      setIsConnected(true);
      setReconnectAttempts(0); // Reset reconnect attempts saat berhasil terhubung
    };

    socket.onmessage = function (event) {
      var data = JSON.parse(event.data);
      onMessage(data);
    };

    socket.onerror = function (error) {
      console.error('WebSocket Error:', error);
      onError(error);
    };

    socket.onclose = function () {
      console.log('WebSocket terputus');
      setIsConnected(false);
      onClose(); // Retry reconnect setelah beberapa detik jika koneksi terputus

      if (reconnectAttempts < 5) {
        var reconnectDelay = Math.min(1000 * (reconnectAttempts + 1), 5000); // Delay retry yang semakin meningkat

        setReconnectAttempts(function (prev) {
          return prev + 1;
        });
        setTimeout(function () {
          openSocket(); // Coba membuka koneksi lagi
        }, reconnectDelay);
      }
    };

    setSocket(socket); // Cleanup socket saat komponen unmount

    return function () {
      socket.close();
    };
  }, [url, onMessage, onError, onClose, reconnectAttempts]);
  (0, _react.useEffect)(function () {
    var cleanupSocket = openSocket();
    return function () {
      cleanupSocket();
    };
  }, [openSocket]);
  return {
    socket: socket,
    isConnected: isConnected,
    reconnectAttempts: reconnectAttempts
  };
};

exports.useWebSocket = useWebSocket;
function init(e){sampleRate=e.sampleRate,numChannels=e.numChannels,initBuffers()}function record(e){for(var n=0;numChannels>n;n++)recBuffers[n].push(e[n]);recLength+=e[0].length}function exportWAV(e){for(var n=[],t=0;numChannels>t;t++)n.push(mergeBuffers(recBuffers[t],recLength));if(2===numChannels)var r=interleave(n[0],n[1]);else var r=n[0];var a=encodeWAV(r),s=new Blob([a],{type:e});this.postMessage(s)}function getBuffer(){for(var e=[],n=0;numChannels>n;n++)e.push(mergeBuffers(recBuffers[n],recLength));this.postMessage(e)}function clear(){recLength=0,recBuffers=[],initBuffers()}function initBuffers(){for(var e=0;numChannels>e;e++)recBuffers[e]=[]}function mergeBuffers(e,n){for(var t=new Float32Array(n),r=0,a=0;a<e.length;a++)t.set(e[a],r),r+=e[a].length;return t}function interleave(e,n){for(var t=e.length+n.length,r=new Float32Array(t),a=0,s=0;t>a;)r[a++]=e[s],r[a++]=n[s],s++;return r}function floatTo16BitPCM(e,n,t){for(var r=0;r<t.length;r++,n+=2){var a=Math.max(-1,Math.min(1,t[r]));e.setInt16(n,0>a?32768*a:32767*a,!0)}}function writeString(e,n,t){for(var r=0;r<t.length;r++)e.setUint8(n+r,t.charCodeAt(r))}function encodeWAV(e){var n=new ArrayBuffer(44+2*e.length),t=new DataView(n);return writeString(t,0,"RIFF"),t.setUint32(4,36+2*e.length,!0),writeString(t,8,"WAVE"),writeString(t,12,"fmt "),t.setUint32(16,16,!0),t.setUint16(20,1,!0),t.setUint16(22,numChannels,!0),t.setUint32(24,sampleRate,!0),t.setUint32(28,4*sampleRate,!0),t.setUint16(32,2*numChannels,!0),t.setUint16(34,16,!0),writeString(t,36,"data"),t.setUint32(40,2*e.length,!0),floatTo16BitPCM(t,44,e),t}var recLength=0,recBuffers=[],sampleRate,numChannels;this.onmessage=function(e){switch(e.data.command){case"init":init(e.data.config);break;case"record":record(e.data.buffer);break;case"exportWAV":exportWAV(e.data.type);break;case"getBuffer":getBuffer();break;case"clear":clear()}};
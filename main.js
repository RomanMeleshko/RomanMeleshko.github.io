window.onload = function () {

  const localVideo = document.getElementById("localVideo");
  const removeVideo = document.getElementById("remoteVideo");

  const servers = null;
  const api = new WebSocketApi();
  let localPeerConnection, remotePeerConnection = null;


  // local
  navigator.mediaDevices.getUserMedia({video: true, audio: true}).then( (stream) => {
    localVideo.srcObject = stream;

    const videoTrack = stream.getVideoTracks()[0];

    localPeerConnection = new RTCPeerConnection( servers );

    localPeerConnection.addEventListener('icecandidate', (event) => {

      if(event.candidate) {
         api.send( { event: 'LOCAL_CANDIDATE', payload: event.candidate });
      }

      console.log( "candidate " + event.candidate );

    });

    api.on('REMOTE_CANDIDATE', (candidate) => {
        localPeerConnection.addIceCandidate(new RTCPeerConnection( candidate ));
    });

    api.on('REMOTE_DESCRIPTION', (description) => {
      localPeerConnection.setRemoteDescription( description );
    });

    localPeerConnection.addTrack(videoTrack, stream);

    localPeerConnection.createOffer().then( (description) => {
       localPeerConnection.setLocalDescription( description );

       api.send({ event: 'LOCAL_DESCRIPTION', payload: description });

    });


  })
  .catch(( err ) => {
    console.log(err.name + ": " + err.message);
  });





  // remote

  remotePeerConnection = new RTCPeerConnection( servers );

  api.on('LOCAL_DESCRIPTION', ( description ) => {

    remotePeerConnection.setRemoteDescription( description );

    remotePeerConnection.addEventListener('icecandidate', (event) => {

      if(event.candidate) {
         api.send({ event: 'REMOTE_CANDIDATE', payload: event.candidate });
      }

    });

    remotePeerConnection.addEventListener('track', (event) => {

      removeVideo.srcObject = event.streams[0];

    });

    api.on('LOCAL_CANDIDATE', (candidate) => {
        remotePeerConnection.addIceCandidate(new RTCIceCandidate( candidate ));
    });

    remotePeerConnection.createAnswer().then(( description) => {
      remotePeerConnection.setLocalDescription( description );

      api.send({ event: 'REMOTE_DESCRIPTION', payload: description })
    })

  });






  // const peerConnection = new RTCPeerConnection();
  //
  // // Получение локального медиа потока
  // const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
  // stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
  //
  // // Обработка удаленного медиа потока
  // peerConnection.ontrack = (event) => {
  //   const remoteStream = event.streams[0];
  //   document.getElementById('remoteVideo').srcObject = remoteStream;
  // };
  //
  // // Обработка ICE-кандидатов
  // peerConnection.onicecandidate = (event) => {
  //   if (event.candidate) {
  //     // Отправить кандидат удаленному пиру
  //     // sendSignalToRemotePeer({ 'ice': event.candidate });
  //   }
  // };
  //
  // // Создание и отправка offer
  // const offer = await peerConnection.createOffer();
  // await peerConnection.setLocalDescription(offer);
  // // Отправить offer удаленному пиру через сигнализацию


};




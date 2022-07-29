            // varying vec2 vUv;
            // uniform sampler2D uTexture;
            varying vec3 vColor;
            varying float vVisibilities;
            // varying float vRarities;
            
            void main()
            {
                vec4 pointsColor = vec4(vColor,1.0);
                vec4 brightenColor = vec4(1.0);
                vec4 darkenColor = vec4(vec3(0.0),1.0);
                 
                // vec4 outColor = texture2D(uTexture, vUv.xy);

                if(vVisibilities < 0.1) {
                    vec4 midColor =mix( pointsColor,brightenColor,0.9);
                    gl_FragColor =mix( midColor, darkenColor, 0.7);
                }
                if(vVisibilities > 0.1){

                gl_FragColor =pointsColor;
                }
                // gl_FragColor =brightenColor;
                

            }
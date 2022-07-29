varying vec2 vUv;
uniform float uZoom;
attribute vec3 aColor;
attribute vec2 aSizes;
attribute float aVisibilities;
attribute float aRarities;

varying float vVisibilities;
// varying float vRarities;

varying vec3 vColor;

        void main()
        {
            vUv = uv;
            vColor = aColor;
            vVisibilities = aVisibilities;
            // vRarities = aRarities;

            /**
             * Position
             */
            vec4 modelPosition = modelMatrix * vec4(position.x+aSizes.x/2.0,position.y+aSizes.y/2.0,position.z, 1.0);
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            gl_Position = projectedPosition;

            /**
             * Size
             */
            // gl_PointSize = -0.2+1.434*aSizes.x/2.0;
            gl_PointSize = -0.2+1.434*aSizes.x/1.4340;
            gl_PointSize *= uZoom;//(1.0 / - viewPosition.z);
        }
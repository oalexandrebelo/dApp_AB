"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function MouseParticles() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        // Config parameters - smoothed as requested
        const PARTICLE_COUNT = 1500; // Optimized for mobile performance (was 8000)
        const PARTICLE_SIZE = 2.5;
        const INFLUENCE = 200;       // Increased influence for smoother feel
        const STRENGTH = 150.0;
        const LERP_FACTOR = 0.08;   // Lowered from 0.18 for smoother mouse follow

        // Scene Setup
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
        camera.position.z = 10;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio || 1);

        // Append to container
        container.appendChild(renderer.domElement);

        // Resize Handler
        const handleResize = () => {
            if (!container) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            renderer.setSize(w, h);

            camera.left = w / -2;
            camera.right = w / 2;
            camera.top = h / 2;
            camera.bottom = h / -2;
            camera.updateProjectionMatrix();
        };
        handleResize();
        window.addEventListener("resize", handleResize);

        // Geometry Generation
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const originals = new Float32Array(PARTICLE_COUNT * 2);
        const sizes = new Float32Array(PARTICLE_COUNT);

        // Initial calculation based on screen size (approximate)
        const w = window.innerWidth;
        const h = window.innerHeight;
        const maxRadius = Math.max(w, h) * 0.6; // Cover most of the screen

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const idx3 = i * 3;
            const idx2 = i * 2;

            // Random distribution logic from the provided script
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.pow(Math.random(), 0.6) * maxRadius * (0.5 + Math.random() * 0.5);

            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            positions[idx3] = x;
            positions[idx3 + 1] = y;
            positions[idx3 + 2] = (Math.random() - 0.5) * 40;

            originals[idx2] = x;
            originals[idx2 + 1] = y;

            sizes[i] = PARTICLE_SIZE * (0.6 + Math.random() * 1.6);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aOriginal', new THREE.BufferAttribute(originals, 2));
        geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

        // Shaders
        const vertexShader = `
      precision highp float;
      attribute vec2 aOriginal;
      attribute float aSize;
      uniform vec2 uMouse;
      uniform float uStrength;
      uniform float uInfluence;
      uniform float uTime;
      uniform float uPixelRatio;
  
      varying float vAlpha;
  
      void main() {
        vec3 pos = position;
        vec2 diff = pos.xy - uMouse;
        float dist = length(diff);
  
        float force = 0.0;
        if (dist < uInfluence) {
          float t = 1.0 - (dist / uInfluence);
          force = uStrength * pow(t, 1.6) * exp(-dist * 0.01);
        }
  
        vec2 dir = diff / max(dist, 0.001);
        vec2 offset = dir * force;
  
        float jitter = 1.0 + 0.15 * sin(uTime * 0.6 + (pos.x + pos.y) * 0.02);
  
        vec3 displaced = vec3(
          pos.xy + offset * (0.6 + 0.4 * pow(force, 0.8)),
          pos.z
        );
  
        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        float pSize = aSize * (1.0 + force * 0.018) * uPixelRatio * jitter;
        gl_PointSize = pSize;
  
        vAlpha = clamp(0.35 + force * 0.008, 0.0, 1.0);
      }
    `;

        const fragmentShader = `
      precision highp float;
      varying float vAlpha;
      void main() {
        vec2 uv = gl_PointCoord.xy - 0.5;
        float dist = length(uv);
        float a = smoothstep(0.5, 0.45, dist);
        // Using a color that matches the requested vibe (Blue-ish)
        vec3 col = vec3(0.15, 0.45, 1.0);
        gl_FragColor = vec4(col, a * vAlpha * 0.95);
        if (gl_FragColor.a < 0.01) discard;
      }
    `;

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true,
            depthWrite: false,
            uniforms: {
                uMouse: { value: new THREE.Vector2(10000, 10000) },
                uStrength: { value: STRENGTH },
                uInfluence: { value: INFLUENCE },
                uTime: { value: 0 },
                uPixelRatio: { value: window.devicePixelRatio || 1 }
            }
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // Mouse Interaction
        const mouse = { x: 10000, y: 10000 };

        const onMouseMove = (e: MouseEvent) => {
            if (!container) return;
            const rect = container.getBoundingClientRect();
            const cx = e.clientX - rect.left;
            const cy = e.clientY - rect.top;

            // Convert to world coordinates (centered at 0,0)
            // Orthographic camera is width/height centered
            mouse.x = cx - rect.width / 2;
            mouse.y = -(cy - rect.height / 2); // Invert Y for Three.js
        };

        // We attach to window to catch mouse everywhere, but mapping must be relative to container if full screen
        // Since container is fixed full screen, window coords work well with offset
        window.addEventListener('mousemove', onMouseMove);

        // Animation Loop
        let tStart = performance.now();
        let animationId: number;

        const animate = () => {
            const t = (performance.now() - tStart) * 0.001;
            material.uniforms.uTime.value = t;

            const cur = material.uniforms.uMouse.value;
            // Smooth lerp
            cur.x += (mouse.x - cur.x) * LERP_FACTOR;
            cur.y += (mouse.y - cur.y) * LERP_FACTOR;

            renderer.render(scene, camera);
            animationId = requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", onMouseMove);
            cancelAnimationFrame(animationId);
            if (container) {
                container.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ opacity: 0.6 }} // Slight transparency for the effect layer itself
        />
    );
}

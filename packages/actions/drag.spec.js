import test from '@interactjs/_dev/test/test';
import { ActionName } from '@interactjs/core/scope';
import * as helpers from '@interactjs/core/tests/_helpers';
import { extend } from '@interactjs/utils';
import pointerUtils from '@interactjs/utils/pointerUtils';
import drag from './drag';
test('drag action init', (t) => {
    const scope = helpers.mockScope();
    scope.usePlugin(drag);
    t.ok(scope.actions.names.includes(ActionName.Drag), '"drag" in actions.names');
    t.equal(scope.actions.methodDict.drag, 'draggable');
    t.equal(typeof scope.Interactable.prototype.draggable, 'function');
    t.end();
});
test('Interactable.draggable method', (t) => {
    const interactable = {
        options: {
            drag: {},
        },
        draggable: drag.draggable,
        setPerAction: () => { calledSetPerAction = true; },
        setOnEvents: () => { calledSetOnEvents = true; },
    };
    let calledSetPerAction = false;
    let calledSetOnEvents = false;
    t.equal(interactable.draggable(), interactable.options.drag, 'interactable.draggable() returns interactable.options.drag object');
    interactable.draggable(true);
    t.ok(interactable.options.drag.enabled, 'calling `interactable.draggable(true)` enables dragging');
    interactable.draggable(false);
    t.notOk(interactable.options.drag.enabled, 'calling `interactable.draggable(false)` disables dragging');
    interactable.draggable({});
    t.ok(interactable.options.drag.enabled, 'calling `interactable.draggable({})` enables dragging');
    t.ok(calledSetOnEvents, 'calling `interactable.draggable({})` calls this.setOnEvents');
    t.ok(calledSetPerAction, 'calling `interactable.draggable({})` calls this.setPerAction');
    interactable.draggable({ enabled: false });
    t.notOk(interactable.options.drag.enabled, 'calling `interactable.draggable({ enabled: false })` disables dragging');
    const axisSettings = {
        lockAxis: ['x', 'y', 'xy', 'start'],
        startAxis: ['x', 'y', 'xy'],
    };
    for (const axis in axisSettings) {
        for (const value of axisSettings[axis]) {
            const options = {};
            options[axis] = value;
            interactable.draggable(options);
            t.equal(interactable.options.drag[axis], value, '`' + axis + ': "' + value + '"` is set correctly');
            delete interactable.options.drag[axis];
        }
    }
    t.end();
});
test('drag axis', (t) => {
    const scope = helpers.mockScope();
    scope.usePlugin(drag);
    const interaction = scope.interactions.new({});
    const element = {};
    const interactable = {
        options: {
            drag: {},
        },
        target: element,
    };
    const iEvent = { page: {}, client: {}, delta: {}, type: 'dragmove' };
    const opposites = { x: 'y', y: 'x' };
    const eventCoords = {
        page: { x: -1, y: -2 },
        client: { x: -3, y: -4 },
        delta: { x: -5, y: -6 },
    };
    const coords = helpers.newCoordsSet();
    resetCoords();
    interaction.prepared = { name: 'drag', axis: 'xy' };
    interaction.interact = interactable;
    t.test('xy (any direction)', (tt) => {
        scope.interactions.signals.fire('before-action-move', { interaction });
        tt.deepEqual(interaction.coords.start, coords.start, 'coords.start is not modified');
        tt.deepEqual(interaction.coords.delta, coords.delta, 'coords.delta is not modified');
        scope.interactions.signals.fire('action-move', { iEvent, interaction });
        tt.deepEqual(iEvent.page, eventCoords.page, 'page coords are not modified');
        tt.deepEqual(iEvent.delta, eventCoords.delta, 'delta is not modified');
        tt.end();
    });
    for (const axis in opposites) {
        const opposite = opposites[axis];
        t.test(axis + '-axis', (tt) => {
            resetCoords();
            interaction.prepared.axis = axis;
            scope.interactions.signals.fire('action-move', { iEvent, interaction });
            tt.deepEqual(iEvent.delta, {
                [opposite]: 0,
                [axis]: eventCoords.delta[axis],
            }, `opposite axis (${opposite}) delta is 0; target axis (${axis}) delta is not modified`);
            tt.deepEqual(iEvent.page, {
                [opposite]: coords.start.page[opposite],
                [axis]: eventCoords.page[axis],
            }, `page.${opposite} is coords.start value`);
            tt.equal(iEvent.page[axis], eventCoords.page[axis], `page.${axis} is not modified`);
            tt.equal(iEvent.client[opposite], coords.start.client[opposite], `client.${opposite} is coords.start value`);
            tt.equal(iEvent.client[axis], eventCoords.client[axis], `client.${axis} is not modified`);
            tt.end();
        });
    }
    t.end();
    function resetCoords() {
        pointerUtils.copyCoords(iEvent, eventCoords);
        extend(iEvent.delta, eventCoords.delta);
        for (const prop in coords) {
            pointerUtils.copyCoords(interaction.coords[prop], coords[prop]);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZy5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZHJhZy5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLDRCQUE0QixDQUFBO0FBQzdDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQTtBQUNuRCxPQUFPLEtBQUssT0FBTyxNQUFNLGlDQUFpQyxDQUFBO0FBQzFELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUMxQyxPQUFPLFlBQVksTUFBTSxnQ0FBZ0MsQ0FBQTtBQUN6RCxPQUFPLElBQUksTUFBTSxRQUFRLENBQUE7QUFFekIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7SUFDN0IsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFBO0lBRWpDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUE7SUFFckIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLHlCQUF5QixDQUFDLENBQUE7SUFDOUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUE7SUFDbkQsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQTtJQUVsRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUE7QUFDVCxDQUFDLENBQUMsQ0FBQTtBQUVGLElBQUksQ0FBQywrQkFBK0IsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO0lBQzFDLE1BQU0sWUFBWSxHQUFHO1FBQ25CLE9BQU8sRUFBRTtZQUNQLElBQUksRUFBRSxFQUFFO1NBQ1Q7UUFDRCxTQUFT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QyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1NBQ2hFO0lBQ0gsQ0FBQztBQUNILENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRlc3QgZnJvbSAnQGludGVyYWN0anMvX2Rldi90ZXN0L3Rlc3QnXG5pbXBvcnQgeyBBY3Rpb25OYW1lIH0gZnJvbSAnQGludGVyYWN0anMvY29yZS9zY29wZSdcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnQGludGVyYWN0anMvY29yZS90ZXN0cy9faGVscGVycydcbmltcG9ydCB7IGV4dGVuZCB9IGZyb20gJ0BpbnRlcmFjdGpzL3V0aWxzJ1xuaW1wb3J0IHBvaW50ZXJVdGlscyBmcm9tICdAaW50ZXJhY3Rqcy91dGlscy9wb2ludGVyVXRpbHMnXG5pbXBvcnQgZHJhZyBmcm9tICcuL2RyYWcnXG5cbnRlc3QoJ2RyYWcgYWN0aW9uIGluaXQnLCAodCkgPT4ge1xuICBjb25zdCBzY29wZSA9IGhlbHBlcnMubW9ja1Njb3BlKClcblxuICBzY29wZS51c2VQbHVnaW4oZHJhZylcblxuICB0Lm9rKHNjb3BlLmFjdGlvbnMubmFtZXMuaW5jbHVkZXMoQWN0aW9uTmFtZS5EcmFnKSwgJ1wiZHJhZ1wiIGluIGFjdGlvbnMubmFtZXMnKVxuICB0LmVxdWFsKHNjb3BlLmFjdGlvbnMubWV0aG9kRGljdC5kcmFnLCAnZHJhZ2dhYmxlJylcbiAgdC5lcXVhbCh0eXBlb2Ygc2NvcGUuSW50ZXJhY3RhYmxlLnByb3RvdHlwZS5kcmFnZ2FibGUsICdmdW5jdGlvbicpXG5cbiAgdC5lbmQoKVxufSlcblxudGVzdCgnSW50ZXJhY3RhYmxlLmRyYWdnYWJsZSBtZXRob2QnLCAodCkgPT4ge1xuICBjb25zdCBpbnRlcmFjdGFibGUgPSB7XG4gICAgb3B0aW9uczoge1xuICAgICAgZHJhZzoge30sXG4gICAgfSxcbiAgICBkcmFnZ2FibGU6IGRyYWcuZHJhZ2dhYmxlLFxuICAgIHNldFBlckFjdGlvbjogKCkgPT4geyBjYWxsZWRTZXRQZXJBY3Rpb24gPSB0cnVlIH0sXG4gICAgc2V0T25FdmVudHM6ICgpID0+IHsgY2FsbGVkU2V0T25FdmVudHMgPSB0cnVlIH0sXG4gIH0gYXMgdW5rbm93biBhcyBJbnRlcmFjdC5JbnRlcmFjdGFibGVcbiAgbGV0IGNhbGxlZFNldFBlckFjdGlvbiA9IGZhbHNlXG4gIGxldCBjYWxsZWRTZXRPbkV2ZW50cyA9IGZhbHNlXG5cbiAgdC5lcXVhbChpbnRlcmFjdGFibGUuZHJhZ2dhYmxlKCksIGludGVyYWN0YWJsZS5vcHRpb25zLmRyYWcsXG4gICAgJ2ludGVyYWN0YWJsZS5kcmFnZ2FibGUoKSByZXR1cm5zIGludGVyYWN0YWJsZS5vcHRpb25zLmRyYWcgb2JqZWN0JylcblxuICBpbnRlcmFjdGFibGUuZHJhZ2dhYmxlKHRydWUpXG4gIHQub2soaW50ZXJhY3RhYmxlLm9wdGlvbnMuZHJhZy5lbmFibGVkLFxuICAgICdjYWxsaW5nIGBpbnRlcmFjdGFibGUuZHJhZ2dhYmxlKHRydWUpYCBlbmFibGVzIGRyYWdnaW5nJylcblxuICBpbnRlcmFjdGFibGUuZHJhZ2dhYmxlKGZhbHNlKVxuICB0Lm5vdE9rKGludGVyYWN0YWJsZS5vcHRpb25zLmRyYWcuZW5hYmxlZCxcbiAgICAnY2FsbGluZyBgaW50ZXJhY3RhYmxlLmRyYWdnYWJsZShmYWxzZSlgIGRpc2FibGVzIGRyYWdnaW5nJylcblxuICBpbnRlcmFjdGFibGUuZHJhZ2dhYmxlKHt9KVxuICB0Lm9rKGludGVyYWN0YWJsZS5vcHRpb25zLmRyYWcuZW5hYmxlZCxcbiAgICAnY2FsbGluZyBgaW50ZXJhY3RhYmxlLmRyYWdnYWJsZSh7fSlgIGVuYWJsZXMgZHJhZ2dpbmcnKVxuICB0Lm9rKGNhbGxlZFNldE9uRXZlbnRzLFxuICAgICdjYWxsaW5nIGBpbnRlcmFjdGFibGUuZHJhZ2dhYmxlKHt9KWAgY2FsbHMgdGhpcy5zZXRPbkV2ZW50cycpXG4gIHQub2soY2FsbGVkU2V0UGVyQWN0aW9uLFxuICAgICdjYWxsaW5nIGBpbnRlcmFjdGFibGUuZHJhZ2dhYmxlKHt9KWAgY2FsbHMgdGhpcy5zZXRQZXJBY3Rpb24nKVxuXG4gIGludGVyYWN0YWJsZS5kcmFnZ2FibGUoeyBlbmFibGVkOiBmYWxzZSB9KVxuICB0Lm5vdE9rKGludGVyYWN0YWJsZS5vcHRpb25zLmRyYWcuZW5hYmxlZCxcbiAgICAnY2FsbGluZyBgaW50ZXJhY3RhYmxlLmRyYWdnYWJsZSh7IGVuYWJsZWQ6IGZhbHNlIH0pYCBkaXNhYmxlcyBkcmFnZ2luZycpXG5cbiAgY29uc3QgYXhpc1NldHRpbmdzID0ge1xuICAgIGxvY2tBeGlzOiBbJ3gnLCAneScsICd4eScsICdzdGFydCddLFxuICAgIHN0YXJ0QXhpczogWyd4JywgJ3knLCAneHknXSxcbiAgfVxuXG4gIGZvciAoY29uc3QgYXhpcyBpbiBheGlzU2V0dGluZ3MpIHtcbiAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIGF4aXNTZXR0aW5nc1theGlzXSkge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IHt9XG5cbiAgICAgIG9wdGlvbnNbYXhpc10gPSB2YWx1ZVxuXG4gICAgICBpbnRlcmFjdGFibGUuZHJhZ2dhYmxlKG9wdGlvbnMpXG4gICAgICB0LmVxdWFsKGludGVyYWN0YWJsZS5vcHRpb25zLmRyYWdbYXhpc10sIHZhbHVlLFxuICAgICAgICAnYCcgKyBheGlzICsgJzogXCInICsgdmFsdWUgKyAnXCJgIGlzIHNldCBjb3JyZWN0bHknKVxuXG4gICAgICBkZWxldGUgaW50ZXJhY3RhYmxlLm9wdGlvbnMuZHJhZ1theGlzXVxuICAgIH1cbiAgfVxuXG4gIHQuZW5kKClcbn0pXG5cbnRlc3QoJ2RyYWcgYXhpcycsICh0KSA9PiB7XG4gIGNvbnN0IHNjb3BlID0gaGVscGVycy5tb2NrU2NvcGUoKVxuXG4gIHNjb3BlLnVzZVBsdWdpbihkcmFnKVxuXG4gIGNvbnN0IGludGVyYWN0aW9uID0gc2NvcGUuaW50ZXJhY3Rpb25zLm5ldyh7fSlcbiAgY29uc3QgZWxlbWVudCA9IHt9XG4gIGNvbnN0IGludGVyYWN0YWJsZSA9IHtcbiAgICBvcHRpb25zOiB7XG4gICAgICBkcmFnOiB7fSxcbiAgICB9LFxuICAgIHRhcmdldDogZWxlbWVudCxcbiAgfSBhcyBJbnRlcmFjdC5JbnRlcmFjdGFibGVcbiAgY29uc3QgaUV2ZW50ID0geyBwYWdlOiB7fSwgY2xpZW50OiB7fSwgZGVsdGE6IHt9LCB0eXBlOiAnZHJhZ21vdmUnIH0gYXMgSW50ZXJhY3QuSW50ZXJhY3RFdmVudFxuXG4gIGNvbnN0IG9wcG9zaXRlcyA9IHsgeDogJ3knLCB5OiAneCcgfVxuICBjb25zdCBldmVudENvb3JkcyA9IHtcbiAgICBwYWdlOiB7IHg6IC0xLCB5OiAtMiB9LFxuICAgIGNsaWVudDogeyB4OiAtMywgeTogLTQgfSxcbiAgICBkZWx0YTogeyB4OiAtNSwgeTogLTYgfSxcbiAgfVxuICBjb25zdCBjb29yZHMgPSBoZWxwZXJzLm5ld0Nvb3Jkc1NldCgpXG5cbiAgcmVzZXRDb29yZHMoKVxuICBpbnRlcmFjdGlvbi5wcmVwYXJlZCA9IHsgbmFtZTogJ2RyYWcnLCBheGlzOiAneHknIH1cbiAgaW50ZXJhY3Rpb24uaW50ZXJhY3QgPSBpbnRlcmFjdGFibGVcblxuICB0LnRlc3QoJ3h5IChhbnkgZGlyZWN0aW9uKScsICh0dCkgPT4ge1xuICAgIHNjb3BlLmludGVyYWN0aW9ucy5zaWduYWxzLmZpcmUoJ2JlZm9yZS1hY3Rpb24tbW92ZScsIHsgaW50ZXJhY3Rpb24gfSlcblxuICAgIHR0LmRlZXBFcXVhbChpbnRlcmFjdGlvbi5jb29yZHMuc3RhcnQsIGNvb3Jkcy5zdGFydCxcbiAgICAgICdjb29yZHMuc3RhcnQgaXMgbm90IG1vZGlmaWVkJylcbiAgICB0dC5kZWVwRXF1YWwoaW50ZXJhY3Rpb24uY29vcmRzLmRlbHRhLCBjb29yZHMuZGVsdGEsXG4gICAgICAnY29vcmRzLmRlbHRhIGlzIG5vdCBtb2RpZmllZCcpXG5cbiAgICBzY29wZS5pbnRlcmFjdGlvbnMuc2lnbmFscy5maXJlKCdhY3Rpb24tbW92ZScsIHsgaUV2ZW50LCBpbnRlcmFjdGlvbiB9KVxuXG4gICAgdHQuZGVlcEVxdWFsKGlFdmVudC5wYWdlLCBldmVudENvb3Jkcy5wYWdlLCAncGFnZSBjb29yZHMgYXJlIG5vdCBtb2RpZmllZCcpXG4gICAgdHQuZGVlcEVxdWFsKGlFdmVudC5kZWx0YSwgZXZlbnRDb29yZHMuZGVsdGEsICdkZWx0YSBpcyBub3QgbW9kaWZpZWQnKVxuXG4gICAgdHQuZW5kKClcbiAgfSlcblxuICBmb3IgKGNvbnN0IGF4aXMgaW4gb3Bwb3NpdGVzKSB7XG4gICAgY29uc3Qgb3Bwb3NpdGUgPSBvcHBvc2l0ZXNbYXhpc11cblxuICAgIHQudGVzdChheGlzICsgJy1heGlzJywgKHR0KSA9PiB7XG4gICAgICByZXNldENvb3JkcygpXG4gICAgICBpbnRlcmFjdGlvbi5wcmVwYXJlZC5heGlzID0gYXhpcyBhcyBhbnlcblxuICAgICAgc2NvcGUuaW50ZXJhY3Rpb25zLnNpZ25hbHMuZmlyZSgnYWN0aW9uLW1vdmUnLCB7IGlFdmVudCwgaW50ZXJhY3Rpb24gfSlcblxuICAgICAgdHQuZGVlcEVxdWFsKFxuICAgICAgICBpRXZlbnQuZGVsdGEsXG4gICAgICAgIHtcbiAgICAgICAgICBbb3Bwb3NpdGVdOiAwLFxuICAgICAgICAgIFtheGlzXTogZXZlbnRDb29yZHMuZGVsdGFbYXhpc10sXG4gICAgICAgIH0sXG4gICAgICAgIGBvcHBvc2l0ZSBheGlzICgke29wcG9zaXRlfSkgZGVsdGEgaXMgMDsgdGFyZ2V0IGF4aXMgKCR7YXhpc30pIGRlbHRhIGlzIG5vdCBtb2RpZmllZGApXG5cbiAgICAgIHR0LmRlZXBFcXVhbChcbiAgICAgICAgaUV2ZW50LnBhZ2UsXG4gICAgICAgIHtcbiAgICAgICAgICBbb3Bwb3NpdGVdOiBjb29yZHMuc3RhcnQucGFnZVtvcHBvc2l0ZV0sXG4gICAgICAgICAgW2F4aXNdOiBldmVudENvb3Jkcy5wYWdlW2F4aXNdLFxuICAgICAgICB9LFxuICAgICAgICBgcGFnZS4ke29wcG9zaXRlfSBpcyBjb29yZHMuc3RhcnQgdmFsdWVgXG4gICAgICApXG5cbiAgICAgIHR0LmVxdWFsKFxuICAgICAgICBpRXZlbnQucGFnZVtheGlzXSxcbiAgICAgICAgZXZlbnRDb29yZHMucGFnZVtheGlzXSxcbiAgICAgICAgYHBhZ2UuJHtheGlzfSBpcyBub3QgbW9kaWZpZWRgXG4gICAgICApXG5cbiAgICAgIHR0LmVxdWFsKFxuICAgICAgICBpRXZlbnQuY2xpZW50W29wcG9zaXRlXSxcbiAgICAgICAgY29vcmRzLnN0YXJ0LmNsaWVudFtvcHBvc2l0ZV0sXG4gICAgICAgIGBjbGllbnQuJHtvcHBvc2l0ZX0gaXMgY29vcmRzLnN0YXJ0IHZhbHVlYFxuICAgICAgKVxuICAgICAgdHQuZXF1YWwoXG4gICAgICAgIGlFdmVudC5jbGllbnRbYXhpc10sXG4gICAgICAgIGV2ZW50Q29vcmRzLmNsaWVudFtheGlzXSxcbiAgICAgICAgYGNsaWVudC4ke2F4aXN9IGlzIG5vdCBtb2RpZmllZGBcbiAgICAgIClcblxuICAgICAgdHQuZW5kKClcbiAgICB9KVxuICB9XG5cbiAgdC5lbmQoKVxuXG4gIGZ1bmN0aW9uIHJlc2V0Q29vcmRzICgpIHtcbiAgICBwb2ludGVyVXRpbHMuY29weUNvb3JkcyhpRXZlbnQsIGV2ZW50Q29vcmRzKVxuICAgIGV4dGVuZChpRXZlbnQuZGVsdGEsIGV2ZW50Q29vcmRzLmRlbHRhKVxuXG4gICAgZm9yIChjb25zdCBwcm9wIGluIGNvb3Jkcykge1xuICAgICAgcG9pbnRlclV0aWxzLmNvcHlDb29yZHMoaW50ZXJhY3Rpb24uY29vcmRzW3Byb3BdLCBjb29yZHNbcHJvcF0pXG4gICAgfVxuICB9XG59KVxuIl19
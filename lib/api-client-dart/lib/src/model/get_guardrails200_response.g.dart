// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'get_guardrails200_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$GetGuardrails200Response extends GetGuardrails200Response {
  @override
  final BuiltList<BuiltMap<String, JsonObject?>>? signals;
  @override
  final BuiltMap<String, JsonObject?>? prefs;

  factory _$GetGuardrails200Response(
          [void Function(GetGuardrails200ResponseBuilder)? updates]) =>
      (GetGuardrails200ResponseBuilder()..update(updates))._build();

  _$GetGuardrails200Response._({this.signals, this.prefs}) : super._();
  @override
  GetGuardrails200Response rebuild(
          void Function(GetGuardrails200ResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  GetGuardrails200ResponseBuilder toBuilder() =>
      GetGuardrails200ResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is GetGuardrails200Response &&
        signals == other.signals &&
        prefs == other.prefs;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, signals.hashCode);
    _$hash = $jc(_$hash, prefs.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'GetGuardrails200Response')
          ..add('signals', signals)
          ..add('prefs', prefs))
        .toString();
  }
}

class GetGuardrails200ResponseBuilder
    implements
        Builder<GetGuardrails200Response, GetGuardrails200ResponseBuilder> {
  _$GetGuardrails200Response? _$v;

  ListBuilder<BuiltMap<String, JsonObject?>>? _signals;
  ListBuilder<BuiltMap<String, JsonObject?>> get signals =>
      _$this._signals ??= ListBuilder<BuiltMap<String, JsonObject?>>();
  set signals(ListBuilder<BuiltMap<String, JsonObject?>>? signals) =>
      _$this._signals = signals;

  MapBuilder<String, JsonObject?>? _prefs;
  MapBuilder<String, JsonObject?> get prefs =>
      _$this._prefs ??= MapBuilder<String, JsonObject?>();
  set prefs(MapBuilder<String, JsonObject?>? prefs) => _$this._prefs = prefs;

  GetGuardrails200ResponseBuilder() {
    GetGuardrails200Response._defaults(this);
  }

  GetGuardrails200ResponseBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _signals = $v.signals?.toBuilder();
      _prefs = $v.prefs?.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(GetGuardrails200Response other) {
    _$v = other as _$GetGuardrails200Response;
  }

  @override
  void update(void Function(GetGuardrails200ResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  GetGuardrails200Response build() => _build();

  _$GetGuardrails200Response _build() {
    _$GetGuardrails200Response _$result;
    try {
      _$result = _$v ??
          _$GetGuardrails200Response._(
            signals: _signals?.build(),
            prefs: _prefs?.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'signals';
        _signals?.build();
        _$failedField = 'prefs';
        _prefs?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'GetGuardrails200Response', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint

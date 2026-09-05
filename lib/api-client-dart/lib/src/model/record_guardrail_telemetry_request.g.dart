// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'record_guardrail_telemetry_request.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$RecordGuardrailTelemetryRequest
    extends RecordGuardrailTelemetryRequest {
  @override
  final String kind;
  @override
  final String? instrument;
  @override
  final bool? proceeded;
  @override
  final BuiltMap<String, JsonObject?>? metadata;

  factory _$RecordGuardrailTelemetryRequest(
          [void Function(RecordGuardrailTelemetryRequestBuilder)? updates]) =>
      (RecordGuardrailTelemetryRequestBuilder()..update(updates))._build();

  _$RecordGuardrailTelemetryRequest._(
      {required this.kind, this.instrument, this.proceeded, this.metadata})
      : super._();
  @override
  RecordGuardrailTelemetryRequest rebuild(
          void Function(RecordGuardrailTelemetryRequestBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  RecordGuardrailTelemetryRequestBuilder toBuilder() =>
      RecordGuardrailTelemetryRequestBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is RecordGuardrailTelemetryRequest &&
        kind == other.kind &&
        instrument == other.instrument &&
        proceeded == other.proceeded &&
        metadata == other.metadata;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, kind.hashCode);
    _$hash = $jc(_$hash, instrument.hashCode);
    _$hash = $jc(_$hash, proceeded.hashCode);
    _$hash = $jc(_$hash, metadata.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'RecordGuardrailTelemetryRequest')
          ..add('kind', kind)
          ..add('instrument', instrument)
          ..add('proceeded', proceeded)
          ..add('metadata', metadata))
        .toString();
  }
}

class RecordGuardrailTelemetryRequestBuilder
    implements
        Builder<RecordGuardrailTelemetryRequest,
            RecordGuardrailTelemetryRequestBuilder> {
  _$RecordGuardrailTelemetryRequest? _$v;

  String? _kind;
  String? get kind => _$this._kind;
  set kind(String? kind) => _$this._kind = kind;

  String? _instrument;
  String? get instrument => _$this._instrument;
  set instrument(String? instrument) => _$this._instrument = instrument;

  bool? _proceeded;
  bool? get proceeded => _$this._proceeded;
  set proceeded(bool? proceeded) => _$this._proceeded = proceeded;

  MapBuilder<String, JsonObject?>? _metadata;
  MapBuilder<String, JsonObject?> get metadata =>
      _$this._metadata ??= MapBuilder<String, JsonObject?>();
  set metadata(MapBuilder<String, JsonObject?>? metadata) =>
      _$this._metadata = metadata;

  RecordGuardrailTelemetryRequestBuilder() {
    RecordGuardrailTelemetryRequest._defaults(this);
  }

  RecordGuardrailTelemetryRequestBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _kind = $v.kind;
      _instrument = $v.instrument;
      _proceeded = $v.proceeded;
      _metadata = $v.metadata?.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(RecordGuardrailTelemetryRequest other) {
    _$v = other as _$RecordGuardrailTelemetryRequest;
  }

  @override
  void update(void Function(RecordGuardrailTelemetryRequestBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  RecordGuardrailTelemetryRequest build() => _build();

  _$RecordGuardrailTelemetryRequest _build() {
    _$RecordGuardrailTelemetryRequest _$result;
    try {
      _$result = _$v ??
          _$RecordGuardrailTelemetryRequest._(
            kind: BuiltValueNullFieldError.checkNotNull(
                kind, r'RecordGuardrailTelemetryRequest', 'kind'),
            instrument: instrument,
            proceeded: proceeded,
            metadata: _metadata?.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'metadata';
        _metadata?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'RecordGuardrailTelemetryRequest', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint

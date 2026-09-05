// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'record_guardrail_telemetry201_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$RecordGuardrailTelemetry201Response
    extends RecordGuardrailTelemetry201Response {
  @override
  final bool ok;
  @override
  final int id;

  factory _$RecordGuardrailTelemetry201Response(
          [void Function(RecordGuardrailTelemetry201ResponseBuilder)?
              updates]) =>
      (RecordGuardrailTelemetry201ResponseBuilder()..update(updates))._build();

  _$RecordGuardrailTelemetry201Response._({required this.ok, required this.id})
      : super._();
  @override
  RecordGuardrailTelemetry201Response rebuild(
          void Function(RecordGuardrailTelemetry201ResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  RecordGuardrailTelemetry201ResponseBuilder toBuilder() =>
      RecordGuardrailTelemetry201ResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is RecordGuardrailTelemetry201Response &&
        ok == other.ok &&
        id == other.id;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, ok.hashCode);
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'RecordGuardrailTelemetry201Response')
          ..add('ok', ok)
          ..add('id', id))
        .toString();
  }
}

class RecordGuardrailTelemetry201ResponseBuilder
    implements
        Builder<RecordGuardrailTelemetry201Response,
            RecordGuardrailTelemetry201ResponseBuilder> {
  _$RecordGuardrailTelemetry201Response? _$v;

  bool? _ok;
  bool? get ok => _$this._ok;
  set ok(bool? ok) => _$this._ok = ok;

  int? _id;
  int? get id => _$this._id;
  set id(int? id) => _$this._id = id;

  RecordGuardrailTelemetry201ResponseBuilder() {
    RecordGuardrailTelemetry201Response._defaults(this);
  }

  RecordGuardrailTelemetry201ResponseBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _ok = $v.ok;
      _id = $v.id;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(RecordGuardrailTelemetry201Response other) {
    _$v = other as _$RecordGuardrailTelemetry201Response;
  }

  @override
  void update(
      void Function(RecordGuardrailTelemetry201ResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  RecordGuardrailTelemetry201Response build() => _build();

  _$RecordGuardrailTelemetry201Response _build() {
    final _$result = _$v ??
        _$RecordGuardrailTelemetry201Response._(
          ok: BuiltValueNullFieldError.checkNotNull(
              ok, r'RecordGuardrailTelemetry201Response', 'ok'),
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'RecordGuardrailTelemetry201Response', 'id'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint

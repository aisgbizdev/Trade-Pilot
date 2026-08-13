// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'push_test_result.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$PushTestResult extends PushTestResult {
  @override
  final int delivered;

  factory _$PushTestResult([void Function(PushTestResultBuilder)? updates]) =>
      (PushTestResultBuilder()..update(updates))._build();

  _$PushTestResult._({required this.delivered}) : super._();
  @override
  PushTestResult rebuild(void Function(PushTestResultBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  PushTestResultBuilder toBuilder() => PushTestResultBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is PushTestResult && delivered == other.delivered;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, delivered.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'PushTestResult')
          ..add('delivered', delivered))
        .toString();
  }
}

class PushTestResultBuilder
    implements Builder<PushTestResult, PushTestResultBuilder> {
  _$PushTestResult? _$v;

  int? _delivered;
  int? get delivered => _$this._delivered;
  set delivered(int? delivered) => _$this._delivered = delivered;

  PushTestResultBuilder() {
    PushTestResult._defaults(this);
  }

  PushTestResultBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _delivered = $v.delivered;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(PushTestResult other) {
    _$v = other as _$PushTestResult;
  }

  @override
  void update(void Function(PushTestResultBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  PushTestResult build() => _build();

  _$PushTestResult _build() {
    final _$result = _$v ??
        _$PushTestResult._(
          delivered: BuiltValueNullFieldError.checkNotNull(
              delivered, r'PushTestResult', 'delivered'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint

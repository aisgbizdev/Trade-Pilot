// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'progression_activity_input.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ProgressionActivityInput extends ProgressionActivityInput {
  @override
  final String token;

  factory _$ProgressionActivityInput(
          [void Function(ProgressionActivityInputBuilder)? updates]) =>
      (ProgressionActivityInputBuilder()..update(updates))._build();

  _$ProgressionActivityInput._({required this.token}) : super._();
  @override
  ProgressionActivityInput rebuild(
          void Function(ProgressionActivityInputBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProgressionActivityInputBuilder toBuilder() =>
      ProgressionActivityInputBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProgressionActivityInput && token == other.token;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, token.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ProgressionActivityInput')
          ..add('token', token))
        .toString();
  }
}

class ProgressionActivityInputBuilder
    implements
        Builder<ProgressionActivityInput, ProgressionActivityInputBuilder> {
  _$ProgressionActivityInput? _$v;

  String? _token;
  String? get token => _$this._token;
  set token(String? token) => _$this._token = token;

  ProgressionActivityInputBuilder() {
    ProgressionActivityInput._defaults(this);
  }

  ProgressionActivityInputBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _token = $v.token;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ProgressionActivityInput other) {
    _$v = other as _$ProgressionActivityInput;
  }

  @override
  void update(void Function(ProgressionActivityInputBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProgressionActivityInput build() => _build();

  _$ProgressionActivityInput _build() {
    final _$result = _$v ??
        _$ProgressionActivityInput._(
          token: BuiltValueNullFieldError.checkNotNull(
              token, r'ProgressionActivityInput', 'token'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint

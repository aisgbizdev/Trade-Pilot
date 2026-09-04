// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'native_push_unregister_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$NativePushUnregisterBody extends NativePushUnregisterBody {
  @override
  final String token;

  factory _$NativePushUnregisterBody(
          [void Function(NativePushUnregisterBodyBuilder)? updates]) =>
      (NativePushUnregisterBodyBuilder()..update(updates))._build();

  _$NativePushUnregisterBody._({required this.token}) : super._();
  @override
  NativePushUnregisterBody rebuild(
          void Function(NativePushUnregisterBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  NativePushUnregisterBodyBuilder toBuilder() =>
      NativePushUnregisterBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is NativePushUnregisterBody && token == other.token;
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
    return (newBuiltValueToStringHelper(r'NativePushUnregisterBody')
          ..add('token', token))
        .toString();
  }
}

class NativePushUnregisterBodyBuilder
    implements
        Builder<NativePushUnregisterBody, NativePushUnregisterBodyBuilder> {
  _$NativePushUnregisterBody? _$v;

  String? _token;
  String? get token => _$this._token;
  set token(String? token) => _$this._token = token;

  NativePushUnregisterBodyBuilder() {
    NativePushUnregisterBody._defaults(this);
  }

  NativePushUnregisterBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _token = $v.token;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(NativePushUnregisterBody other) {
    _$v = other as _$NativePushUnregisterBody;
  }

  @override
  void update(void Function(NativePushUnregisterBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  NativePushUnregisterBody build() => _build();

  _$NativePushUnregisterBody _build() {
    final _$result = _$v ??
        _$NativePushUnregisterBody._(
          token: BuiltValueNullFieldError.checkNotNull(
              token, r'NativePushUnregisterBody', 'token'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint

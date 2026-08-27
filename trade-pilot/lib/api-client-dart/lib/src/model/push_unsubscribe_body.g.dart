// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'push_unsubscribe_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$PushUnsubscribeBody extends PushUnsubscribeBody {
  @override
  final String endpoint;

  factory _$PushUnsubscribeBody(
          [void Function(PushUnsubscribeBodyBuilder)? updates]) =>
      (PushUnsubscribeBodyBuilder()..update(updates))._build();

  _$PushUnsubscribeBody._({required this.endpoint}) : super._();
  @override
  PushUnsubscribeBody rebuild(
          void Function(PushUnsubscribeBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  PushUnsubscribeBodyBuilder toBuilder() =>
      PushUnsubscribeBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is PushUnsubscribeBody && endpoint == other.endpoint;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, endpoint.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'PushUnsubscribeBody')
          ..add('endpoint', endpoint))
        .toString();
  }
}

class PushUnsubscribeBodyBuilder
    implements Builder<PushUnsubscribeBody, PushUnsubscribeBodyBuilder> {
  _$PushUnsubscribeBody? _$v;

  String? _endpoint;
  String? get endpoint => _$this._endpoint;
  set endpoint(String? endpoint) => _$this._endpoint = endpoint;

  PushUnsubscribeBodyBuilder() {
    PushUnsubscribeBody._defaults(this);
  }

  PushUnsubscribeBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _endpoint = $v.endpoint;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(PushUnsubscribeBody other) {
    _$v = other as _$PushUnsubscribeBody;
  }

  @override
  void update(void Function(PushUnsubscribeBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  PushUnsubscribeBody build() => _build();

  _$PushUnsubscribeBody _build() {
    final _$result = _$v ??
        _$PushUnsubscribeBody._(
          endpoint: BuiltValueNullFieldError.checkNotNull(
              endpoint, r'PushUnsubscribeBody', 'endpoint'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint

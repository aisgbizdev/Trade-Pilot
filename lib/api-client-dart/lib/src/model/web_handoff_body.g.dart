// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'web_handoff_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$WebHandoffBody extends WebHandoffBody {
  @override
  final String next;

  factory _$WebHandoffBody([void Function(WebHandoffBodyBuilder)? updates]) =>
      (WebHandoffBodyBuilder()..update(updates))._build();

  _$WebHandoffBody._({required this.next}) : super._();
  @override
  WebHandoffBody rebuild(void Function(WebHandoffBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  WebHandoffBodyBuilder toBuilder() => WebHandoffBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is WebHandoffBody && next == other.next;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, next.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'WebHandoffBody')..add('next', next))
        .toString();
  }
}

class WebHandoffBodyBuilder
    implements Builder<WebHandoffBody, WebHandoffBodyBuilder> {
  _$WebHandoffBody? _$v;

  String? _next;
  String? get next => _$this._next;
  set next(String? next) => _$this._next = next;

  WebHandoffBodyBuilder() {
    WebHandoffBody._defaults(this);
  }

  WebHandoffBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _next = $v.next;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(WebHandoffBody other) {
    _$v = other as _$WebHandoffBody;
  }

  @override
  void update(void Function(WebHandoffBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  WebHandoffBody build() => _build();

  _$WebHandoffBody _build() {
    final _$result = _$v ??
        _$WebHandoffBody._(
          next: BuiltValueNullFieldError.checkNotNull(
              next, r'WebHandoffBody', 'next'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint

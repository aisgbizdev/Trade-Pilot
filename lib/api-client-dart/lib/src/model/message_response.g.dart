// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'message_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$MessageResponse extends MessageResponse {
  @override
  final String message;

  factory _$MessageResponse([void Function(MessageResponseBuilder)? updates]) =>
      (MessageResponseBuilder()..update(updates))._build();

  _$MessageResponse._({required this.message}) : super._();
  @override
  MessageResponse rebuild(void Function(MessageResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  MessageResponseBuilder toBuilder() => MessageResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is MessageResponse && message == other.message;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, message.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'MessageResponse')
          ..add('message', message))
        .toString();
  }
}

class MessageResponseBuilder
    implements Builder<MessageResponse, MessageResponseBuilder> {
  _$MessageResponse? _$v;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  MessageResponseBuilder() {
    MessageResponse._defaults(this);
  }

  MessageResponseBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _message = $v.message;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(MessageResponse other) {
    _$v = other as _$MessageResponse;
  }

  @override
  void update(void Function(MessageResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  MessageResponse build() => _build();

  _$MessageResponse _build() {
    final _$result = _$v ??
        _$MessageResponse._(
          message: BuiltValueNullFieldError.checkNotNull(
              message, r'MessageResponse', 'message'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
